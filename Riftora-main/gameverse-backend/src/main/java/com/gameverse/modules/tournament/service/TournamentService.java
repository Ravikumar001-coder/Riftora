package com.gameverse.modules.tournament.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.game.repository.GameRepository;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.registration.repository.RegistrationRepository;
import com.gameverse.modules.scoring.model.ScoringTemplate;
import com.gameverse.modules.scoring.repository.ScoringTemplateRepository;
import com.gameverse.modules.tournament.dto.CreateTournamentRequest;
import com.gameverse.modules.tournament.dto.UpdateTournamentRequest;
import com.gameverse.modules.tournament.dto.ChangeTournamentStatusRequest;
import com.gameverse.modules.tournament.dto.PostponeTournamentRequest;
import com.gameverse.modules.tournament.dto.TournamentDto;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.entity.GameConfigurationTemplate;
import com.gameverse.modules.tournament.entity.Tournament.TournamentStatus;
import com.gameverse.modules.tournament.entity.PrizePosition;
import com.gameverse.modules.tournament.entity.TournamentMessage;
import com.gameverse.modules.tournament.entity.TournamentStaff;
import com.gameverse.modules.tournament.exception.TournamentTransitionException;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import com.gameverse.modules.tournament.repository.TournamentSpecification;
import com.gameverse.modules.tournament.dto.TournamentSearchRequest;
import com.gameverse.modules.tournament.repository.TournamentStaffRepository;
import com.gameverse.core.websocket.WebSocketEventPublisher;
import com.gameverse.modules.broadcast.service.YoutubeIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TournamentStaffRepository staffRepository;
    private final OrganizationRepository orgRepository;
    private final GameRepository gameRepository;
    private final ScoringTemplateRepository scoringTemplateRepository;
    private final com.gameverse.modules.tournament.repository.GameConfigurationTemplateRepository gameConfigurationTemplateRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final WebSocketEventPublisher eventPublisher;
    private final YoutubeIntegrationService youtubeIntegrationService;

    @Transactional
    public TournamentDto createTournament(String userId, CreateTournamentRequest request) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Organization org = orgRepository.findById(request.getOrgId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Generate slug
        String baseSlug = (request.getSlug() != null && !request.getSlug().isBlank()) ? 
                request.getSlug() : request.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        String finalSlug = baseSlug;
        int count = 1;
        while (tournamentRepository.findBySlug(finalSlug).isPresent()) {
            finalSlug = baseSlug + "-" + count++;
        }

        Tournament tournament = new Tournament();
        tournament.setOrganization(org);
        tournament.setGame(game);
        tournament.setCreatedBy(creator);
        
        tournament.setName(request.getName());
        tournament.setSlug(finalSlug);
        tournament.setTournamentType(request.getTournamentType());
        tournament.setEditionNumber(request.getEditionNumber());
        if (request.getTournamentTier() != null) {
            tournament.setTournamentTier(request.getTournamentTier());
        }
        tournament.setDescription(request.getDescription());
        tournament.setBannerUrl(request.getBannerUrl() != null ? request.getBannerUrl() : org.getBannerUrl());
        tournament.setLogoUrl(request.getLogoUrl() != null ? request.getLogoUrl() : org.getLogoUrl());
        
        // Copy brand kit from org
        tournament.setSecondaryLogoUrl(org.getSecondaryLogoUrl());
        tournament.setPrimaryColor(org.getPrimaryColor());
        tournament.setSecondaryColor(org.getSecondaryColor());
        tournament.setAccentColor(org.getAccentColor());
        tournament.setPrimaryFont(org.getPrimaryFont());
        tournament.setSecondaryFont(org.getSecondaryFont());
        tournament.setBrandTagline(org.getBrandTagline());

        tournament.setStartDate(request.getStartDate());
        tournament.setEndDate(request.getEndDate());
        
        // Apply default required constraints
        tournament.setMinTeamSize(request.getMinTeamSize() != null ? request.getMinTeamSize() : 1);
        tournament.setMaxTeamSize(request.getMaxTeamSize() != null ? request.getMaxTeamSize() : 1);
        tournament.setTeamsPerMatch(2);
        tournament.setTotalTeamSlots(16);
        tournament.setTotalRounds(1);
        
        // Default Dates for Registration
        tournament.setRegistrationOpen(LocalDateTime.now());
        tournament.setRegistrationClose(request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now().plusDays(7));
        
        // Find a fallback scoring template since it's required by the DB
        List<ScoringTemplate> defaultTemplates = scoringTemplateRepository.findByGame_GameIdAndIsSystemTemplateTrue(game.getGameId());
        if (!defaultTemplates.isEmpty()) {
            tournament.setScoringTemplate(defaultTemplates.get(0));
        } else {
            List<ScoringTemplate> allTemplates = scoringTemplateRepository.findAll();
            if (!allTemplates.isEmpty()) {
                tournament.setScoringTemplate(allTemplates.get(0));
            } else {
                ScoringTemplate newTemplate = new ScoringTemplate();
                newTemplate.setGame(game);
                newTemplate.setTemplateName("Default Scoring");
                newTemplate.setSystemTemplate(true);
                newTemplate.setKillPtsEach(BigDecimal.ONE);
                newTemplate = scoringTemplateRepository.save(newTemplate);
                tournament.setScoringTemplate(newTemplate);
            }
        }
        
        tournament.setStatus(Tournament.TournamentStatus.draft);
        tournament.setMasterAccessCode(generateAccessCode("ADMIN"));
        tournament = tournamentRepository.save(tournament);

        // Add creator as tournament director automatically
        TournamentStaff staff = new TournamentStaff();
        staff.setTournament(tournament);
        staff.setUser(creator);
        staff.setStaffRole(TournamentStaff.StaffRole.tournament_dir);
        staffRepository.save(staff);

        return mapToDto(tournament);
    }

    @Transactional
    public TournamentDto updateTournament(String tournamentId, String userId, com.gameverse.modules.tournament.dto.UpdateTournamentRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        // Todo: Verify user has rights to edit this tournament

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            tournament.setName(request.getName().trim());
        }
        if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
            String slugToSet = request.getSlug().trim();
            tournamentRepository.findBySlug(slugToSet).ifPresent(existing -> {
                if (!existing.getTournamentId().equals(tournamentId)) {
                    throw new IllegalArgumentException("Slug must be unique");
                }
            });
            tournament.setSlug(slugToSet);
        }
        if (request.getThemeType() != null) tournament.setThemeType(request.getThemeType());
        if (request.getTournamentType() != null) tournament.setTournamentType(request.getTournamentType());
        if (request.getEditionNumber() != null) tournament.setEditionNumber(request.getEditionNumber());
        if (request.getTournamentTier() != null) tournament.setTournamentTier(request.getTournamentTier());
        if (request.getDescription() != null) tournament.setDescription(request.getDescription());
        if (request.getLogoUrl() != null) tournament.setLogoUrl(request.getLogoUrl());
        if (request.getBannerUrl() != null) tournament.setBannerUrl(request.getBannerUrl());
        if (request.getSecondaryLogoUrl() != null) tournament.setSecondaryLogoUrl(request.getSecondaryLogoUrl());
        if (request.getPrimaryColor() != null) tournament.setPrimaryColor(request.getPrimaryColor());
        if (request.getSecondaryColor() != null) tournament.setSecondaryColor(request.getSecondaryColor());
        if (request.getAccentColor() != null) tournament.setAccentColor(request.getAccentColor());
        if (request.getPrimaryFont() != null) tournament.setPrimaryFont(request.getPrimaryFont());
        if (request.getSecondaryFont() != null) tournament.setSecondaryFont(request.getSecondaryFont());
        if (request.getBrandTagline() != null) tournament.setBrandTagline(request.getBrandTagline());

        // Locking logic for FR-05-014 and FR-05-015
        boolean isLocked = tournament.getStatus() != TournamentStatus.draft && tournament.getStatus() != TournamentStatus.published;

        if (isLocked) {
            // Restrictions removed as per user request to allow editing Total Teams Capacity and Match Format

            if (request.getEntryFee() != null && request.getEntryFee().compareTo(tournament.getEntryFee()) != 0) {
                // Mock notification
                System.out.println("Mock: Notifying registered teams about entry fee change for tournament: " + tournamentId);
            }
        }

        if (!isLocked && request.getScoringTemplateId() != null) {
            ScoringTemplate template = scoringTemplateRepository.findById(request.getScoringTemplateId())
                    .orElseThrow(() -> new RuntimeException("Scoring Template not found"));
            tournament.setScoringTemplate(template);
        }

        if (!isLocked && request.getGameConfigTemplateId() != null) {
            GameConfigurationTemplate template = gameConfigurationTemplateRepository.findById(request.getGameConfigTemplateId())
                    .orElseThrow(() -> new RuntimeException("Game Configuration Template not found"));
            tournament.setGameConfigTemplate(template);
        }

        if (request.getFormatType() != null) tournament.setFormatType(request.getFormatType());
        if (request.getTeamsPerMatch() != null) tournament.setTeamsPerMatch(request.getTeamsPerMatch());
        tournament.setTotalTeamSlots(request.getTotalTeamSlots());
        
        tournament.setTotalRounds(request.getTotalRounds());
        tournament.setMatchesPerRound(request.getMatchesPerRound());
        if (request.getMapPool() != null) tournament.setMapPool(request.getMapPool());
        if (request.getTiebreakerRules() != null) {
            try {
                Tournament.TiebreakerRule rule = Tournament.TiebreakerRule.valueOf(request.getTiebreakerRules().toUpperCase());
                tournament.setTiebreakerSequence(List.of(rule));
            } catch (Exception e) {
                // Ignore invalid rule
            }
        }

        if (request.getStartDate() != null) tournament.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) tournament.setEndDate(request.getEndDate());
        if (request.getScheduledPublishDate() != null) tournament.setScheduledPublishDate(request.getScheduledPublishDate());
        if (request.getRegistrationOpen() != null) tournament.setRegistrationOpen(request.getRegistrationOpen());
        if (request.getRegistrationClose() != null) tournament.setRegistrationClose(request.getRegistrationClose());

        tournament.setEntryFee(request.getEntryFee());
        if (request.getPaymentMethods() != null) tournament.setPaymentMethods(request.getPaymentMethods());
        if (request.getMinTeamSize() != null) tournament.setMinTeamSize(request.getMinTeamSize());
        if (request.getMaxTeamSize() != null) tournament.setMaxTeamSize(request.getMaxTeamSize());
        if (request.getMaxSubstitutes() != null) tournament.setMaxSubstitutes(request.getMaxSubstitutes());
        if (request.getApprovalMode() != null) tournament.setApprovalMode(request.getApprovalMode());
        if (request.getWaitlistEnabled() != null) tournament.setWaitlistEnabled(request.getWaitlistEnabled());
        if (request.getWaitlistCapacity() != null) tournament.setWaitlistCapacity(request.getWaitlistCapacity());
        if (request.getCheckinRequired() != null) tournament.setCheckinRequired(request.getCheckinRequired());
        if (request.getCheckinOpenMins() != null) tournament.setCheckinOpenMins(request.getCheckinOpenMins());
        if (request.getCheckinCloseMins() != null) tournament.setCheckinCloseMins(request.getCheckinCloseMins());

        if (request.getPrizePoolTotal() != null) tournament.setPrizePoolTotal(request.getPrizePoolTotal());
        if (request.getPrizeCurrency() != null) tournament.setPrizeCurrency(request.getPrizeCurrency());
        if (request.getPrizeFundedBy() != null) tournament.setPrizeFundedBy(request.getPrizeFundedBy());

        if (request.getStreamUrl() != null) tournament.setStreamUrl(request.getStreamUrl());
        if (request.getStreamPlatform() != null) tournament.setStreamPlatform(request.getStreamPlatform());

        // Process Prize Positions
        if (request.getPrizePositions() != null) {
            tournament.getPrizePositions().clear();
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (UpdateTournamentRequest.PrizePositionDto dto : request.getPrizePositions()) {
                PrizePosition pos = new PrizePosition();
                pos.setTournament(tournament);
                pos.setPosition(dto.getPosition());
                pos.setLabel(dto.getLabel());
                pos.setCategory(dto.getCategory());
                pos.setPercentage(dto.getPercentage());
                
                BigDecimal amount = dto.getAmount();
                if (dto.getPercentage() != null && tournament.getPrizePoolTotal() != null) {
                    amount = tournament.getPrizePoolTotal()
                            .multiply(dto.getPercentage())
                            .divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
                }
                pos.setAmount(amount);
                
                if (amount != null) {
                    totalAmount = totalAmount.add(amount);
                }
                tournament.getPrizePositions().add(pos);
            }
            if (tournament.getPrizePoolTotal() != null && totalAmount.compareTo(tournament.getPrizePoolTotal()) > 0) {
                throw new IllegalArgumentException("Total prize distribution (" + totalAmount + ") exceeds the stated prize pool (" + tournament.getPrizePoolTotal() + ").");
            }
        }

        // Process Messages
        if (request.getMessages() != null) {
            tournament.getMessages().clear();
            for (UpdateTournamentRequest.TournamentMessageDto dto : request.getMessages()) {
                TournamentMessage msg = new TournamentMessage();
                msg.setTournament(tournament);
                msg.setCreatedBy(tournament.getCreatedBy());
                msg.setMessageType(dto.getMessageType());
                msg.setTitle(dto.getTitle());
                msg.setBody(dto.getBody());
                tournament.getMessages().add(msg);
            }
        }

        // Process Staff
        if (request.getStaff() != null) {
            tournament.getStaff().clear();
            java.util.List<String> emails = request.getStaff().stream()
                    .map(UpdateTournamentRequest.TournamentStaffDto::getEmail)
                    .toList();
            
            if (!emails.isEmpty()) {
                java.util.List<User> users = userRepository.findByEmailIn(emails);
                java.util.Map<String, User> userMap = users.stream()
                        .collect(java.util.stream.Collectors.toMap(User::getEmail, u -> u));
                
                for (UpdateTournamentRequest.TournamentStaffDto dto : request.getStaff()) {
                    User u = userMap.get(dto.getEmail());
                    if (u != null) {
                        TournamentStaff ts = new TournamentStaff();
                        ts.setTournament(tournament);
                        ts.setUser(u);
                        ts.setStaffRole(dto.getStaffRole());
                        tournament.getStaff().add(ts);
                    }
                }
            }
        }

        return mapToDto(tournamentRepository.save(tournament));
    }

    @Transactional
    public TournamentDto syncBrandKit(String tournamentId, String userId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        Organization org = tournament.getOrganization();

        tournament.setLogoUrl(org.getLogoUrl());
        tournament.setBannerUrl(org.getBannerUrl());
        tournament.setSecondaryLogoUrl(org.getSecondaryLogoUrl());
        tournament.setPrimaryColor(org.getPrimaryColor());
        tournament.setSecondaryColor(org.getSecondaryColor());
        tournament.setAccentColor(org.getAccentColor());
        tournament.setPrimaryFont(org.getPrimaryFont());
        tournament.setSecondaryFont(org.getSecondaryFont());
        tournament.setBrandTagline(org.getBrandTagline());

        return mapToDto(tournamentRepository.save(tournament));
    }

    @Transactional
    public TournamentDto changeTournamentStatus(String tournamentId, ChangeTournamentStatusRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        TournamentStatus current = tournament.getStatus();
        TournamentStatus target = request.getStatus();

        if (current == target) {
            return mapToDto(tournament);
        }

        // Validate transition
        if (target == TournamentStatus.cancelled) {
            if (current == TournamentStatus.completed || current == TournamentStatus.cancelled) {
                throw new TournamentTransitionException("Cannot cancel a tournament that is already completed or cancelled.");
            }
            tournament.setCancellationReason(request.getCancellationReason());
            // TODO: In a real implementation, we would query the RegistrationRepository and notify each team.
            // But since RegistrationService and RegistrationRepository are separate, we fire an event or notify.
            System.out.println("Mock: Notifying all teams of cancellation for tournament: " + tournamentId);
            System.out.println("Mock: Refunding entry fees for tournament: " + tournamentId);
        } else if (current == TournamentStatus.draft && target == TournamentStatus.published) {
            tournament.setPublishedAt(LocalDateTime.now());
        } else if (current == TournamentStatus.published && target == TournamentStatus.registration_open) {
            // allowed
        } else if (current == TournamentStatus.registration_open && target == TournamentStatus.registration_closed) {
            // allowed
        } else if (current == TournamentStatus.registration_closed && (target == TournamentStatus.check_in || target == TournamentStatus.live)) {
            // allowed
        } else if (current == TournamentStatus.check_in && target == TournamentStatus.live) {
            // allowed
        } else if (current == TournamentStatus.live && target == TournamentStatus.completed) {
            // allowed
            try {
                youtubeIntegrationService.updateStreamTitleForTournamentEnd(
                    tournament.getOrganization().getOrgId(),
                    tournament.getName()
                );
            } catch (Exception e) {
                System.err.println("Failed to update YouTube stream title: " + e.getMessage());
            }
        } else {
            throw new TournamentTransitionException("Illegal state transition from " + current + " to " + target);
        }

        tournament.setStatus(target);
        return mapToDto(tournamentRepository.save(tournament));
    }

    @Transactional
    public TournamentDto postponeTournament(String tournamentId, PostponeTournamentRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (!Boolean.TRUE.equals(tournament.getIsPostponed())) {
            tournament.setOriginalStartDate(tournament.getStartDate());
            tournament.setOriginalEndDate(tournament.getEndDate());
            tournament.setIsPostponed(true);
        }

        tournament.setStartDate(request.getNewStartDate());
        tournament.setEndDate(request.getNewEndDate());
        if (request.getNewRegistrationOpen() != null) tournament.setRegistrationOpen(request.getNewRegistrationOpen());
        if (request.getNewRegistrationClose() != null) tournament.setRegistrationClose(request.getNewRegistrationClose());
        tournament.setPostponementReason(request.getReason());

        System.out.println("Mock: Notifying registered teams about postponement for tournament: " + tournamentId);

        return mapToDto(tournamentRepository.save(tournament));
    }

    @Transactional
    public TournamentDto publishSchedule(String tournamentId, String actorId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (Boolean.TRUE.equals(tournament.getSchedulePublished())) {
            throw new RuntimeException("Schedule is already published");
        }

        tournament.setSchedulePublished(true);
        tournament = tournamentRepository.save(tournament);

        // Fetch all approved registrations
        java.util.List<Registration> approvedTeams = registrationRepository.findByTournament_TournamentId(
            tournamentId, org.springframework.data.domain.Pageable.unpaged()
        ).getContent().stream()
         .filter(r -> r.getStatus() == Registration.RegistrationStatus.approved)
         .toList();

        // Notify teams via STOMP (and mocked email)
        for (Registration r : approvedTeams) {
            String captainId = r.getCaptain().getUserId();
            String captainEmail = r.getCaptain().getEmail(); // Assume user has email, though mocked

            System.out.println("Mock [FR-07-011]: Sending schedule summary email to " + captainEmail);

            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("type", "SCHEDULE_PUBLISHED");
            payload.put("tournamentId", tournamentId);
            payload.put("tournamentName", tournament.getName());
            payload.put("message", "The schedule for " + tournament.getName() + " has been published!");

            eventPublisher.sendToUserQueue(captainId, "/queue/notifications", payload);
        }
        
        // Also broadcast to public if needed
        eventPublisher.broadcastMatchStatus(tournamentId, java.util.Map.of("type", "SCHEDULE_PUBLISHED"));

        return mapToDto(tournament);
    }

    @Transactional
    public TournamentDto cloneTournament(String tournamentId, String userId) {
        Tournament original = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        Tournament clone = new Tournament();
        clone.setName(original.getName() + " (Copy)");
        clone.setSlug(original.getSlug() + "-copy-" + System.currentTimeMillis());
        clone.setOrganization(original.getOrganization());
        clone.setGame(original.getGame());
        
        clone.setTournamentType(original.getTournamentType());
        clone.setTournamentTier(original.getTournamentTier());
        clone.setDescription(original.getDescription());
        clone.setLogoUrl(original.getLogoUrl());
        clone.setBannerUrl(original.getBannerUrl());
        clone.setRulesText(original.getRulesText());
        clone.setRulebookUrl(original.getRulebookUrl());
        clone.setFormatType(original.getFormatType());
        clone.setTeamsPerMatch(original.getTeamsPerMatch());
        clone.setTotalTeamSlots(original.getTotalTeamSlots());
        clone.setTotalRounds(original.getTotalRounds());
        clone.setMatchesPerRound(original.getMatchesPerRound());
        clone.setMapPool(original.getMapPool());
        clone.setScoringTemplate(original.getScoringTemplate());
        
        // Blank dates
        clone.setStartDate(null);
        clone.setEndDate(null);
        clone.setRegistrationOpen(null);
        clone.setRegistrationClose(null);
        
        clone.setEntryFee(original.getEntryFee());
        clone.setPaymentMethods(original.getPaymentMethods());
        clone.setMinTeamSize(original.getMinTeamSize());
        clone.setMaxTeamSize(original.getMaxTeamSize());
        clone.setMaxSubstitutes(original.getMaxSubstitutes());
        clone.setApprovalMode(original.getApprovalMode());
        clone.setWaitlistEnabled(original.getWaitlistEnabled());
        clone.setWaitlistCapacity(original.getWaitlistCapacity());
        clone.setCheckinRequired(original.getCheckinRequired());
        clone.setCheckinOpenMins(original.getCheckinOpenMins());
        clone.setCheckinCloseMins(original.getCheckinCloseMins());
        
        clone.setPrizePoolTotal(original.getPrizePoolTotal());
        clone.setPrizeCurrency(original.getPrizeCurrency());
        clone.setPrizeFundedBy(original.getPrizeFundedBy());

        // Clone collections (without IDs)
        for (PrizePosition p : original.getPrizePositions()) {
            PrizePosition np = new PrizePosition();
            np.setTournament(clone);
            np.setPosition(p.getPosition());
            np.setLabel(p.getLabel());
            np.setAmount(p.getAmount());
            np.setPercentage(p.getPercentage());
            clone.getPrizePositions().add(np);
        }

        for (TournamentMessage m : original.getMessages()) {
            TournamentMessage nm = new TournamentMessage();
            nm.setTournament(clone);
            nm.setMessageType(m.getMessageType());
            nm.setTitle(m.getTitle());
            nm.setBody(m.getBody());
            clone.getMessages().add(nm);
        }
        
        // We won't clone staff, or maybe we do? FR-05-016 says "creating an exact copy of all settings". Let's clone staff.
        for (TournamentStaff s : original.getStaff()) {
            TournamentStaff ns = new TournamentStaff();
            ns.setTournament(clone);
            ns.setUser(s.getUser());
            ns.setStaffRole(s.getStaffRole());
            clone.getStaff().add(ns);
        }
        
        clone.setStatus(TournamentStatus.draft);
        
        // Add creator as director if not already in staff
        boolean hasCreator = clone.getStaff().stream().anyMatch(s -> s.getUser().getUserId().equals(userId));
        if (!hasCreator) {
            com.gameverse.modules.auth.entity.User user = new com.gameverse.modules.auth.entity.User();
            user.setUserId(userId);
            TournamentStaff dir = new TournamentStaff();
            dir.setTournament(clone);
            dir.setUser(user);
            dir.setStaffRole(TournamentStaff.StaffRole.tournament_dir);
            clone.getStaff().add(dir);
        }

        return mapToDto(tournamentRepository.save(clone));
    }

    @Transactional
    public TournamentDto saveAsTemplate(String tournamentId, String userId) {
        Tournament original = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        Tournament template = new Tournament();
        template.setName(original.getName() + " (Template)");
        template.setSlug(original.getSlug() + "-template-" + System.currentTimeMillis());
        template.setOrganization(original.getOrganization());
        template.setGame(original.getGame());
        
        com.gameverse.modules.auth.entity.User createdBy = new com.gameverse.modules.auth.entity.User();
        createdBy.setUserId(userId);
        template.setCreatedBy(createdBy);
        
        template.setTournamentType(original.getTournamentType());
        template.setTournamentTier(original.getTournamentTier());
        template.setDescription(original.getDescription());
        template.setLogoUrl(original.getLogoUrl());
        template.setBannerUrl(original.getBannerUrl());
        template.setRulesText(original.getRulesText());
        template.setRulebookUrl(original.getRulebookUrl());
        template.setFormatType(original.getFormatType());
        template.setTeamsPerMatch(original.getTeamsPerMatch());
        template.setTotalTeamSlots(original.getTotalTeamSlots());
        template.setTotalRounds(original.getTotalRounds());
        template.setMatchesPerRound(original.getMatchesPerRound());
        template.setMapPool(original.getMapPool());
        template.setScoringTemplate(original.getScoringTemplate());
        
        // Blank dates
        template.setStartDate(null);
        template.setEndDate(null);
        template.setRegistrationOpen(null);
        template.setRegistrationClose(null);
        
        template.setEntryFee(original.getEntryFee());
        template.setPaymentMethods(original.getPaymentMethods());
        template.setMinTeamSize(original.getMinTeamSize());
        template.setMaxTeamSize(original.getMaxTeamSize());
        template.setMaxSubstitutes(original.getMaxSubstitutes());
        template.setApprovalMode(original.getApprovalMode());
        template.setWaitlistEnabled(original.getWaitlistEnabled());
        template.setWaitlistCapacity(original.getWaitlistCapacity());
        template.setCheckinRequired(original.getCheckinRequired());
        template.setCheckinOpenMins(original.getCheckinOpenMins());
        template.setCheckinCloseMins(original.getCheckinCloseMins());
        
        template.setPrizePoolTotal(original.getPrizePoolTotal());
        template.setPrizeCurrency(original.getPrizeCurrency());
        template.setPrizeFundedBy(original.getPrizeFundedBy());
        
        template.setIsTemplate(true);
        template.setStatus(TournamentStatus.draft);

        // Clone collections (without IDs)
        for (PrizePosition p : original.getPrizePositions()) {
            PrizePosition np = new PrizePosition();
            np.setTournament(template);
            np.setPosition(p.getPosition());
            np.setLabel(p.getLabel());
            np.setCategory(p.getCategory());
            np.setAmount(p.getAmount());
            np.setPercentage(p.getPercentage());
            template.getPrizePositions().add(np);
        }

        for (TournamentMessage m : original.getMessages()) {
            TournamentMessage nm = new TournamentMessage();
            nm.setTournament(template);
            nm.setMessageType(m.getMessageType());
            nm.setTitle(m.getTitle());
            nm.setBody(m.getBody());
            template.getMessages().add(nm);
        }
        
        return mapToDto(tournamentRepository.save(template));
    }

    @Transactional(readOnly = true)
    public Page<TournamentDto> getOrgTournaments(String orgId, Pageable pageable) {
        return tournamentRepository.findByOrganization_OrgId(orgId, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public Page<TournamentDto> getPublicTournamentsByGame(String gameId, Pageable pageable) {
        return tournamentRepository.findByGame_GameIdAndStatusIn(
                gameId,
                java.util.List.of(Tournament.TournamentStatus.published, Tournament.TournamentStatus.registration_open),
                pageable
        ).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public Page<TournamentDto> exploreTournaments(TournamentSearchRequest request, Pageable pageable) {
        return tournamentRepository.findAll(TournamentSpecification.getTournamentsByCriteria(request), pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public TournamentDto getTournamentBySlug(String slug) {
        Tournament tournament = tournamentRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        return mapToDto(tournament);
    }

    @Transactional(readOnly = true)
    public TournamentDto getTournament(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        return mapToDto(tournament);
    }

    @Transactional
    public TournamentDto regenerateMasterCode(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        
        tournament.setMasterAccessCode(generateAccessCode("ADMIN"));
        return mapToDto(tournamentRepository.save(tournament));
    }

    @Transactional
    public void joinViaCode(String code, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Tournament tournament = tournamentRepository.findByMasterAccessCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid access code"));
                
        final TournamentStaff.StaffRole finalRole = TournamentStaff.StaffRole.tournament_dir;

        boolean alreadyStaff = staffRepository.findByTournament_TournamentId(tournament.getTournamentId())
                .stream().anyMatch(s -> s.getUser().getUserId().equals(userId) && s.getStaffRole() == finalRole);
                
        if (!alreadyStaff) {
            TournamentStaff staff = new TournamentStaff();
            staff.setTournament(tournament);
            staff.setUser(user);
            staff.setStaffRole(finalRole);
            staffRepository.save(staff);
        }
    }

    private TournamentDto mapToDto(Tournament t) {
        long currentConfirmed = 0;
        boolean isFull = false;
        if (t.getTournamentId() != null) {
            currentConfirmed = registrationRepository.countByTournament_TournamentIdAndStatusIn(
                t.getTournamentId(), 
                java.util.List.of(Registration.RegistrationStatus.approved, Registration.RegistrationStatus.submitted)
            );
            isFull = t.getTotalTeamSlots() != null && currentConfirmed >= t.getTotalTeamSlots();
        }

        return TournamentDto.builder()
                .tournamentId(t.getTournamentId())
                .orgId(t.getOrganization().getOrgId())
                .gameId(t.getGame().getGameId())
                .gameName(t.getGame().getGameName())
                .scoringTemplateId(t.getScoringTemplate() != null ? t.getScoringTemplate().getId() : null)
                .createdByUserId(t.getCreatedBy().getUserId())
                .name(t.getName())
                .slug(t.getSlug())
                .themeType(t.getThemeType())
                .tournamentType(t.getTournamentType())
                .editionNumber(t.getEditionNumber())
                .tournamentTier(t.getTournamentTier())
                .description(t.getDescription())
                .logoUrl(t.getLogoUrl())
                .bannerUrl(t.getBannerUrl())
                .secondaryLogoUrl(t.getSecondaryLogoUrl())
                .primaryColor(t.getPrimaryColor())
                .secondaryColor(t.getSecondaryColor())
                .accentColor(t.getAccentColor())
                .primaryFont(t.getPrimaryFont())
                .secondaryFont(t.getSecondaryFont())
                .brandTagline(t.getBrandTagline())
                .formatType(t.getFormatType())
                .teamsPerMatch(t.getTeamsPerMatch())
                .totalTeamSlots(t.getTotalTeamSlots())
                .slotsTaken((int) currentConfirmed)
                .isFull(isFull)
                .totalRounds(t.getTotalRounds())
                .matchesPerRound(t.getMatchesPerRound())
                .mapPool(t.getMapPool())
                .tiebreakerRules(t.getTiebreakerSequence() != null && !t.getTiebreakerSequence().isEmpty() ? t.getTiebreakerSequence().get(0).name().toLowerCase() : "head_to_head")
                .startDate(t.getStartDate())
                .endDate(t.getEndDate())
                .registrationOpen(t.getRegistrationOpen())
                .registrationClose(t.getRegistrationClose())
                .entryFee(t.getEntryFee())
                .paymentMethods(t.getPaymentMethods())
                .minTeamSize(t.getMinTeamSize())
                .maxTeamSize(t.getMaxTeamSize())
                .maxSubstitutes(t.getMaxSubstitutes())
                .approvalMode(t.getApprovalMode())
                .waitlistEnabled(t.getWaitlistEnabled())
                .waitlistCapacity(t.getWaitlistCapacity())
                .checkinRequired(t.getCheckinRequired())
                .checkinOpenMins(t.getCheckinOpenMins())
                .checkinCloseMins(t.getCheckinCloseMins())
                .prizePoolTotal(t.getPrizePoolTotal())
                .prizeCurrency(t.getPrizeCurrency())
                .prizeFundedBy(t.getPrizeFundedBy())
                .masterAccessCode(t.getMasterAccessCode())
                .status(t.getStatus())
                .publishedAt(t.getPublishedAt())
                .scheduledPublishDate(t.getScheduledPublishDate())
                .completedAt(t.getCompletedAt())
                .streamUrl(t.getStreamUrl())
                .streamPlatform(t.getStreamPlatform())
                .isTemplate(t.getIsTemplate())
                .schedulePublished(t.getSchedulePublished() != null ? t.getSchedulePublished() : false)
                .autoLockCredentials(t.getAutoLockCredentials() != null ? t.getAutoLockCredentials() : true)
                .autoLockMinsAfterStart(t.getAutoLockMinsAfterStart() != null ? t.getAutoLockMinsAfterStart() : 10)
                .prizePositions(t.getPrizePositions() != null ? t.getPrizePositions().stream().map(p -> {
                    UpdateTournamentRequest.PrizePositionDto dto = new UpdateTournamentRequest.PrizePositionDto();
                    dto.setPosition(p.getPosition());
                    dto.setLabel(p.getLabel());
                    dto.setAmount(p.getAmount());
                    dto.setPercentage(p.getPercentage());
                    dto.setCategory(p.getCategory());
                    return dto;
                }).toList() : null)
                .masterAccessCode(t.getMasterAccessCode())
                .build();
    }

    private String generateAccessCode(String prefix) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder(prefix + "-");
        java.util.Random rnd = new java.util.Random();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
