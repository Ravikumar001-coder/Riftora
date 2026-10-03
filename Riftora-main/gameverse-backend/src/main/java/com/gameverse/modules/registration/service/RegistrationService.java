package com.gameverse.modules.registration.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.registration.dto.CreateRegistrationRequest;
import com.gameverse.modules.registration.dto.RegistrationDto;
import com.gameverse.modules.registration.dto.RegistrationRosterDto;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.registration.entity.RegistrationRoster;
import com.gameverse.modules.registration.entity.PaymentTransaction;
import com.gameverse.modules.registration.repository.PaymentTransactionRepository;
import com.gameverse.modules.registration.repository.RegistrationRepository;
import com.gameverse.modules.registration.repository.RegistrationRosterRepository;
import com.gameverse.modules.registration.repository.RegistrationSpecification;
import com.gameverse.modules.team.entity.Team;
import com.gameverse.modules.team.entity.TeamMember;
import com.gameverse.modules.team.repository.TeamRepository;
import com.gameverse.modules.team.repository.TeamMemberRepository;
import com.gameverse.modules.game.repository.BlacklistUidRepository;
import com.gameverse.modules.game.entity.BlacklistUid;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.gameverse.core.websocket.WebSocketEventPublisher;
import com.gameverse.modules.finance.service.FinanceService;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final RegistrationRosterRepository registrationRosterRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final BlacklistUidRepository blacklistUidRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final WebSocketEventPublisher webSocketEventPublisher;
    private final FinanceService financeService;

    @Transactional
    public RegistrationDto registerTeam(String userId, CreateRegistrationRequest request) {
        User captain = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Tournament tournament = tournamentRepository.findById(request.getTournamentId())
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getCaptain().getUserId().equals(userId)) {
            throw new RuntimeException("Only team captain can register");
        }

        if (registrationRepository.findByTournament_TournamentIdAndTeam_TeamId(tournament.getTournamentId(), team.getTeamId()).isPresent()) {
            throw new RuntimeException("Team already registered for this tournament");
        }

        Registration registration = new Registration();
        registration.setTournament(tournament);
        registration.setTeam(team);
        registration.setCaptain(captain);
        registration.setReferenceNumber("GV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        if (tournament.getEntryFee() != null && tournament.getEntryFee().doubleValue() > 0) {
            registration.setPaymentStatus(Registration.PaymentStatus.pending);
        } else {
            registration.setPaymentStatus(Registration.PaymentStatus.not_required);
        }

        // Validate Team Members (FR-03-013)
        List<String> memberIds = request.getTeamMembers().stream().map(CreateRegistrationRequest.RegistrationRosterEntry::getTeamMemberId).collect(Collectors.toList());
        List<TeamMember> members = teamMemberRepository.findAllById(memberIds);
        if (members.isEmpty()) {
            throw new RuntimeException("No valid team members selected");
        }
        
        long mainPlayersCount = request.getTeamMembers().stream().filter(e -> "player".equalsIgnoreCase(e.getRole())).count();
        if (tournament.getMinTeamSize() != null && mainPlayersCount < tournament.getMinTeamSize()) {
            throw new IllegalArgumentException("Team does not meet the minimum required players: " + tournament.getMinTeamSize());
        }

        String regexPattern = tournament.getGame().getUidRegex();
        Pattern pattern = regexPattern != null && !regexPattern.isEmpty() ? Pattern.compile(regexPattern) : null;
        
        List<String> invalidUids = new ArrayList<>();
        List<String> inGameUids = new ArrayList<>();

        for (CreateRegistrationRequest.RegistrationRosterEntry entry : request.getTeamMembers()) {
            TeamMember member = members.stream().filter(m -> m.getMemberId().equals(entry.getTeamMemberId())).findFirst().orElse(null);
            if (member == null || !member.getTeam().getTeamId().equals(team.getTeamId())) {
                throw new IllegalArgumentException("Team member does not belong to the selected team");
            }
            if (pattern != null && !pattern.matcher(entry.getInGameUid()).matches()) {
                invalidUids.add(entry.getInGameUid() + " (" + member.getUser().getUsername() + ")");
            }
            inGameUids.add(entry.getInGameUid());
        }

        StringBuilder correctionNotes = new StringBuilder();
        if (!invalidUids.isEmpty()) {
            registration.setStatus(Registration.RegistrationStatus.correction_requested);
            correctionNotes.append("Invalid UIDs detected based on game format: ").append(String.join(", ", invalidUids)).append(". ");
        } else {
            registration.setStatus(Registration.RegistrationStatus.draft); // or submitted depending on payment
        }

        // Duplicate UID Check (FR-04-021)
        List<RegistrationRoster> duplicateRosters = registrationRosterRepository
                .findByRegistration_Tournament_TournamentIdAndInGameUidIn(tournament.getTournamentId(), inGameUids);
        
        if (!duplicateRosters.isEmpty()) {
            List<String> dupUids = duplicateRosters.stream().map(RegistrationRoster::getInGameUid).distinct().collect(Collectors.toList());
            throw new IllegalArgumentException("One or more players (UIDs) are already registered in another team for this tournament: " + String.join(", ", dupUids));
        }

        // FR-03-015: Blacklist Check
        List<BlacklistUid> blacklisted = blacklistUidRepository
                .findByGame_GameIdAndUidIn(tournament.getGame().getGameId(), inGameUids);
        if (!blacklisted.isEmpty()) {
            registration.setStatus(Registration.RegistrationStatus.under_review);
            registration.setFlagScore(Registration.FlagScore.red);
            correctionNotes.append("One or more UIDs are blacklisted. ");
        }

        if (correctionNotes.length() > 0) {
            registration.setCorrectionNotes(correctionNotes.toString());
        }

        long currentConfirmed = registrationRepository.countByTournament_TournamentIdAndStatusIn(
            tournament.getTournamentId(), 
            List.of(Registration.RegistrationStatus.approved, Registration.RegistrationStatus.submitted)
        );
        
        if (tournament.getTotalTeamSlots() != null && currentConfirmed >= tournament.getTotalTeamSlots()) {
            if (tournament.getWaitlistEnabled() != null && tournament.getWaitlistEnabled()) {
                registration.setIsWaitlistRequest(true);
            } else {
                throw new IllegalArgumentException("Tournament is full and waitlist is not enabled");
            }
        }

        registration.setReservationExpiresAt(java.time.LocalDateTime.now().plusMinutes(15));

        registration = registrationRepository.save(registration);

        // Save Roster
        for (CreateRegistrationRequest.RegistrationRosterEntry entry : request.getTeamMembers()) {
            TeamMember member = members.stream().filter(m -> m.getMemberId().equals(entry.getTeamMemberId())).findFirst().orElse(null);
            if (member == null) continue;
            
            RegistrationRoster roster = new RegistrationRoster();
            roster.setRegistration(registration);
            roster.setUser(member.getUser());
            roster.setTeamMember(member);
            
            roster.setPlayerRole("substitute".equalsIgnoreCase(entry.getRole()) ? 
                                 RegistrationRoster.PlayerRole.substitute : RegistrationRoster.PlayerRole.player);
            roster.setInGameUid(entry.getInGameUid());
            roster.setInGameName(member.getInGameName());
            registrationRosterRepository.save(roster);
        }

        return mapToDto(registration);
    }

    @Transactional(readOnly = true)
    public RegistrationDto getRegistration(String registrationId, String userId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));
        // Basic security check: ensure the user is the captain of the team, or admin
        Team team = teamRepository.findById(registration.getTeam().getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        boolean isCaptain = team.getCaptain() != null && team.getCaptain().getUserId().equals(userId);
        if (!isCaptain) {
            throw new org.springframework.security.access.AccessDeniedException("Only team captain can view this registration");
        }
        return mapToDto(registration);
    }

    @Transactional(readOnly = true)
    public Page<RegistrationDto> getTeamRegistrations(String teamId, String userId, Pageable pageable) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        if (!team.getCaptain().getUserId().equals(userId)) {
            throw new RuntimeException("Only team captain can view registrations");
        }
        
        return registrationRepository.findByTeam_TeamId(teamId, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public Page<RegistrationDto> getTournamentRegistrations(String tournamentId, String userId, Pageable pageable) {
        tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        
        // Ensure user is tournament director/organizer
        // For now, assuming authorization is handled at controller/security level
        
        return registrationRepository.findByTournament_TournamentId(tournamentId, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public RegistrationDto getMyRegistrationForTournament(String tournamentId, String userId) {
        return registrationRepository.findAll().stream()
                .filter(r -> r.getTournament().getTournamentId().equals(tournamentId) 
                        && r.getCaptain().getUserId().equals(userId))
                .findFirst()
                .map(this::mapToDto)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<RegistrationRosterDto> getRegistrationRoster(String registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        String regexPattern = registration.getTournament().getGame().getUidRegex();
        Pattern pattern = regexPattern != null && !regexPattern.isEmpty() ? Pattern.compile(regexPattern) : null;
        
        return registrationRosterRepository.findByRegistration_RegistrationId(registrationId).stream()
                .map(roster -> {
                    boolean isVerified = pattern == null || pattern.matcher(roster.getInGameUid()).matches();
                    return RegistrationRosterDto.builder()
                            .rosterId(roster.getRosterId())
                            .userId(roster.getUser().getUserId())
                            .name(roster.getUser().getDisplayName())
                            .username(roster.getUser().getUsername())
                            .inGameUid(roster.getInGameUid())
                            .inGameName(roster.getInGameName())
                            .role(roster.getPlayerRole())
                            .profileUrl("/profile/" + roster.getUser().getUsername()) // Assuming standard URL format
                            .isVerified(isVerified)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateRegistrationStatus(String registrationId, com.gameverse.modules.registration.dto.RegistrationStatusUpdateRequest request, String userId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        User adminUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        registration.setStatus(request.getStatus());
        
        if (request.getStatus() == Registration.RegistrationStatus.rejected) {
            registration.setRejectionReason(request.getNotes());
        } else if (request.getStatus() == Registration.RegistrationStatus.correction_requested) {
            registration.setCorrectionNotes(request.getNotes());
            // Send notification to captain
            webSocketEventPublisher.sendToUserQueue(
                registration.getCaptain().getUserId(), 
                "/queue/notifications", 
                java.util.Map.of(
                    "type", "REGISTRATION_CORRECTION_REQUESTED",
                    "tournamentId", registration.getTournament().getTournamentId(),
                    "message", "Correction requested for registration: " + request.getNotes()
                )
            );
        }
        
        if (request.getStatus() == Registration.RegistrationStatus.approved) {
            registration.setApprovedBy(adminUser);
            registration.setApprovedAt(java.time.LocalDateTime.now());
        }

        registrationRepository.save(registration);
    }

    @Transactional
    public String verifyAllUids(String tournamentId, String userId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        
        String regexPattern = tournament.getGame().getUidRegex();
        if (regexPattern == null || regexPattern.isEmpty()) {
            return "No UID format configured for this game.";
        }
        Pattern pattern = Pattern.compile(regexPattern);
        
        int invalidCount = 0;
        int checkedTeams = 0;
        
        // Only fetch pending/submitted/draft registrations to avoid re-reviewing approved/rejected
        Page<Registration> registrations = registrationRepository.findByTournament_TournamentId(tournamentId, Pageable.unpaged());
        
        for (Registration reg : registrations) {
            if (reg.getStatus() == Registration.RegistrationStatus.approved || reg.getStatus() == Registration.RegistrationStatus.rejected) {
                continue;
            }
            
            checkedTeams++;
            List<RegistrationRoster> rosters = registrationRosterRepository.findByRegistration_RegistrationId(reg.getRegistrationId());
            List<String> invalidUids = new ArrayList<>();
            
            for (RegistrationRoster roster : rosters) {
                if (!pattern.matcher(roster.getInGameUid()).matches()) {
                    invalidUids.add(roster.getInGameUid() + " (" + roster.getUser().getUsername() + ")");
                }
            }
            
            if (!invalidUids.isEmpty()) {
                invalidCount += invalidUids.size();
                reg.setStatus(Registration.RegistrationStatus.correction_requested);
                String currentNotes = reg.getCorrectionNotes() != null ? reg.getCorrectionNotes() : "";
                reg.setCorrectionNotes(currentNotes + " Invalid UIDs flagged in bulk verify: " + String.join(", ", invalidUids) + ".");
                reg.setFlagScore(Registration.FlagScore.yellow);
                registrationRepository.save(reg);
            }
        }
        
        return String.format("Verified %d teams. Flagged %d invalid UIDs.", checkedTeams, invalidCount);
    }

    @Transactional
    public RegistrationDto acceptRules(String registrationId, String userId, String ipAddress) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        if (!registration.getCaptain().getUserId().equals(userId)) {
            throw new RuntimeException("Only team captain can accept rules");
        }
        
        registration.setRulesAgreed(true);
        registration.setRulesAgreedAt(java.time.LocalDateTime.now());
        registration.setRulesAgreedIp(ipAddress);
        registrationRepository.save(registration);
        
        return mapToDto(registration);
    }

    @Transactional
    public RegistrationDto processMockPayment(String registrationId, String userId, String paymentMethod) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
                
        if (!registration.getCaptain().getUserId().equals(userId)) {
            throw new RuntimeException("Only team captain can process payment");
        }

        if (registration.getReservationExpiresAt() != null && registration.getReservationExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Reservation has expired. Please restart registration.");
        }

        if (registration.getTournament().getEntryFee() == null || registration.getTournament().getEntryFee().doubleValue() <= 0) {
            throw new RuntimeException("Tournament is free, payment not required");
        }

        PaymentTransaction txn = new PaymentTransaction();
        txn.setRegistration(registration);
        txn.setUser(registration.getCaptain());
        txn.setGateway("mock_gateway");
        txn.setGatewayOrderId("order_" + UUID.randomUUID().toString().substring(0, 10));
        txn.setGatewayTxnId("txn_" + UUID.randomUUID().toString().substring(0, 10));
        txn.setAmount(registration.getTournament().getEntryFee());
        txn.setCurrency(registration.getTournament().getPrizeCurrency() != null ? registration.getTournament().getPrizeCurrency() : "INR");
        txn.setStatus(PaymentTransaction.PaymentStatus.captured);
        txn.setPaymentMethod(paymentMethod);
        txn.setCapturedAt(java.time.LocalDateTime.now());
        txn = paymentTransactionRepository.save(txn);

        registration.setPaymentTransaction(txn);
        registration.setPaymentStatus(Registration.PaymentStatus.paid);
        registration.setEntryFeePaid(txn.getAmount());
        registrationRepository.save(registration);
        
        // Record in Finance Ledger and calculate platform fee (FR-16-001, FR-16-003)
        financeService.recordEntryFeePayment(registration.getTournament(), registration.getTeam().getTeamId(), txn.getAmount(), txn.getTxnId());
        
        return mapToDto(registration);
    }

    @Transactional
    public RegistrationDto confirmRegistration(String registrationId, String userId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
                
        if (!registration.getCaptain().getUserId().equals(userId)) {
            throw new RuntimeException("Only team captain can confirm registration");
        }
        
        if (registration.getReservationExpiresAt() != null && registration.getReservationExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Reservation has expired. Please restart registration.");
        }
        
        if (!registration.getRulesAgreed()) {
            throw new RuntimeException("Rules must be accepted before confirmation");
        }
        
        if (!Boolean.TRUE.equals(registration.getIsWaitlistRequest()) && registration.getPaymentStatus() == Registration.PaymentStatus.pending) {
            throw new RuntimeException("Payment must be completed before confirmation");
        }

        Tournament tournament = registration.getTournament();
        
        // Check slots
        long currentConfirmed = registrationRepository.countByTournament_TournamentIdAndStatusIn(
            tournament.getTournamentId(), 
            List.of(Registration.RegistrationStatus.approved, Registration.RegistrationStatus.submitted)
        );
        
        if (Boolean.TRUE.equals(registration.getIsWaitlistRequest()) || (tournament.getTotalTeamSlots() != null && currentConfirmed >= tournament.getTotalTeamSlots())) {
            if (tournament.getWaitlistEnabled() != null && tournament.getWaitlistEnabled()) {
                registration.setStatus(Registration.RegistrationStatus.waitlisted);
            } else {
                throw new RuntimeException("Tournament is full and waitlist is not enabled");
            }
        } else {
            // Set to submitted (or approved if auto-approve, but requirements say manual for now)
            registration.setStatus(Registration.RegistrationStatus.submitted);
        }
        
        registration = registrationRepository.save(registration);
        
        // Notify team captain (Simulates confirmation email sent within 60 seconds)
        webSocketEventPublisher.sendToUserQueue(
            registration.getCaptain().getUserId(), 
            "/queue/notifications", 
            java.util.Map.of(
                "type", "REGISTRATION_CONFIRMED",
                "tournamentId", tournament.getTournamentId(),
                "tournamentName", tournament.getName(),
                "message", "Your registration for " + tournament.getName() + " has been confirmed! An email has been sent to you.",
                "status", registration.getStatus().name()
            )
        );
        
        return mapToDto(registration);
    }

    @Transactional
    public RegistrationDto withdrawRegistration(String registrationId, String userId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
                
        if (!registration.getCaptain().getUserId().equals(userId)) {
            throw new RuntimeException("Only team captain can withdraw");
        }
        
        registration.setStatus(Registration.RegistrationStatus.withdrawn);
        
        // If paid, mock refund
        if (registration.getPaymentStatus() == Registration.PaymentStatus.paid && registration.getPaymentTransaction() != null) {
            PaymentTransaction txn = registration.getPaymentTransaction();
            txn.setStatus(PaymentTransaction.PaymentStatus.refunded);
            txn.setRefundedAt(java.time.LocalDateTime.now());
            txn.setRefundId("ref_" + UUID.randomUUID().toString().substring(0, 10));
            paymentTransactionRepository.save(txn);
            
            registration.setPaymentStatus(Registration.PaymentStatus.refunded);
        }
        
        registration = registrationRepository.save(registration);
        
        // Auto promote next team from waitlist
        checkAndPromoteWaitlist(registration.getTournament().getTournamentId());
        
        return mapToDto(registration);
    }
    
    @Transactional
    public void promoteFromWaitlist(String tournamentId, String registrationId, String adminUserId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
                
        if (!registration.getTournament().getTournamentId().equals(tournamentId)) {
            throw new RuntimeException("Registration does not belong to this tournament");
        }
        
        if (registration.getStatus() != Registration.RegistrationStatus.waitlisted) {
            throw new RuntimeException("Registration is not waitlisted");
        }
        
        registration.setStatus(Registration.RegistrationStatus.approved);
        registration.setApprovedBy(userRepository.findById(adminUserId).orElse(null));
        registration.setApprovedAt(java.time.LocalDateTime.now());
        registrationRepository.save(registration);
        
        // Notify captain
        webSocketEventPublisher.sendToUserQueue(
            registration.getCaptain().getUserId(), 
            "/queue/notifications", 
            java.util.Map.of(
                "type", "WAITLIST_PROMOTED",
                "tournamentId", tournamentId,
                "message", "Your team has been promoted from the waitlist and approved!"
            )
        );
    }
    
    private void checkAndPromoteWaitlist(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElse(null);
        if (tournament == null || tournament.getTotalTeamSlots() == null) return;
        
        long currentConfirmed = registrationRepository.countByTournament_TournamentIdAndStatusIn(
            tournamentId, 
            java.util.List.of(Registration.RegistrationStatus.approved, Registration.RegistrationStatus.submitted)
        );
        
        if (currentConfirmed < tournament.getTotalTeamSlots()) {
            // Find oldest waitlisted team (FIFO)
            org.springframework.data.domain.Page<Registration> waitlistedPage = registrationRepository.findAll(
                RegistrationSpecification.getRegistrations(tournamentId, null, Registration.RegistrationStatus.waitlisted, null),
                org.springframework.data.domain.PageRequest.of(0, 1, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "createdAt"))
            );
            
            if (waitlistedPage.hasContent()) {
                Registration nextInLine = waitlistedPage.getContent().get(0);
                nextInLine.setStatus(Registration.RegistrationStatus.submitted); // Ready for payment/approval
                registrationRepository.save(nextInLine);
                
                webSocketEventPublisher.sendToUserQueue(
                    nextInLine.getCaptain().getUserId(), 
                    "/queue/notifications", 
                    java.util.Map.of(
                        "type", "WAITLIST_SLOT_AVAILABLE",
                        "tournamentId", tournamentId,
                        "message", "A slot has opened up! Please complete your registration."
                    )
                );
            }
        }
    }

    public org.springframework.data.domain.Page<RegistrationDto> mapToDtoPage(org.springframework.data.domain.Page<Registration> page) {
        return page.map(this::mapToDto);
    }

    @Transactional
    public void approveRegistration(String tournamentId, String registrationId, String adminUserId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        if (!registration.getTournament().getTournamentId().equals(tournamentId)) {
            throw new RuntimeException("Mismatch tournamentId");
        }
        
        registration.setStatus(Registration.RegistrationStatus.approved);
        registration.setApprovedBy(userRepository.findById(adminUserId).orElse(null));
        registration.setApprovedAt(java.time.LocalDateTime.now());
        
        registrationRepository.save(registration);
        
        // Notify
        webSocketEventPublisher.sendToUserQueue(
            registration.getCaptain().getUserId(), 
            "/queue/notifications", 
            java.util.Map.of(
                "type", "REGISTRATION_APPROVED",
                "tournamentId", tournamentId,
                "message", "Your registration has been approved!"
            )
        );
    }

    @Transactional
    public void rejectRegistration(String tournamentId, String registrationId, String reason, String adminUserId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
                
        if (!registration.getTournament().getTournamentId().equals(tournamentId)) {
            throw new RuntimeException("Mismatch tournamentId");
        }
        
        registration.setStatus(Registration.RegistrationStatus.rejected);
        registration.setRejectionReason(reason);
        
        if (registration.getPaymentStatus() == Registration.PaymentStatus.paid && registration.getPaymentTransaction() != null) {
            PaymentTransaction txn = registration.getPaymentTransaction();
            txn.setStatus(PaymentTransaction.PaymentStatus.refunded);
            txn.setRefundedAt(java.time.LocalDateTime.now());
            txn.setRefundId("ref_" + java.util.UUID.randomUUID().toString().substring(0, 10));
            paymentTransactionRepository.save(txn);
            registration.setPaymentStatus(Registration.PaymentStatus.refunded);
        }
        
        registrationRepository.save(registration);
        
        // Auto promote next team from waitlist
        checkAndPromoteWaitlist(tournamentId);
        
        webSocketEventPublisher.sendToUserQueue(
            registration.getCaptain().getUserId(), 
            "/queue/notifications", 
            java.util.Map.of(
                "type", "REGISTRATION_REJECTED",
                "tournamentId", tournamentId,
                "message", "Your registration was rejected. Reason: " + reason
            )
        );
    }

    @Transactional
    public void requestCorrection(String tournamentId, String registrationId, String notes, String adminUserId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
                
        if (!registration.getTournament().getTournamentId().equals(tournamentId)) {
            throw new RuntimeException("Mismatch tournamentId");
        }
        
        registration.setStatus(Registration.RegistrationStatus.correction_requested);
        registration.setCorrectionNotes(notes);
        registrationRepository.save(registration);
        
        webSocketEventPublisher.sendToUserQueue(
            registration.getCaptain().getUserId(), 
            "/queue/notifications", 
            java.util.Map.of(
                "type", "CORRECTION_REQUESTED",
                "tournamentId", tournamentId,
                "message", "Correction requested for your registration: " + notes
            )
        );
    }

    @Transactional
    public void moveToWaitlist(String tournamentId, String registrationId, String adminUserId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
                
        if (!registration.getTournament().getTournamentId().equals(tournamentId)) {
            throw new RuntimeException("Mismatch tournamentId");
        }
        
        registration.setStatus(Registration.RegistrationStatus.waitlisted);
        registrationRepository.save(registration);
    }

    @Transactional
    public void bulkApprove(String tournamentId, java.util.List<String> registrationIds, String adminUserId) {
        for (String id : registrationIds) {
            approveRegistration(tournamentId, id, adminUserId);
        }
    }

    @Transactional
    public void bulkReject(String tournamentId, java.util.List<String> registrationIds, String reason, String adminUserId) {
        for (String id : registrationIds) {
            rejectRegistration(tournamentId, id, reason, adminUserId);
        }
    }

    @Transactional(readOnly = true)
    public String exportRegistrationsCsv(String tournamentId, String adminUserId) {
        java.util.List<Registration> registrations = registrationRepository.findByTournament_TournamentId(
            tournamentId, 
            org.springframework.data.domain.Pageable.unpaged()
        ).getContent();
        
        StringBuilder sb = new StringBuilder();
        sb.append("Team Name,Team Tag,Captain Username,Captain Email,Status,Payment Status,Registration Date\n");
        
        for (Registration r : registrations) {
            sb.append(escapeCsv(r.getTeam().getTeamName())).append(",")
              .append(escapeCsv(r.getTeam().getTeamTag())).append(",")
              .append(escapeCsv(r.getCaptain().getUsername())).append(",")
              .append(escapeCsv(r.getCaptain().getEmail())).append(",")
              .append(r.getStatus().name()).append(",")
              .append(r.getPaymentStatus().name()).append(",")
              .append(r.getCreatedAt().toString()).append("\n");
        }
        return sb.toString();
    }
    
    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    @Transactional
    public RegistrationDto activateSubstitute(String registrationId, String outgoingUserId, String incomingUserId, String actorId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!registration.getCaptain().getUserId().equals(actorId) && !isAdmin(actorId)) {
            throw new RuntimeException("Only captain or admin can activate substitutes");
        }

        List<RegistrationRoster> rosters = registrationRosterRepository.findByRegistration_RegistrationId(registrationId);
        
        RegistrationRoster outgoing = rosters.stream()
                .filter(r -> r.getUser().getUserId().equals(outgoingUserId) && r.getPlayerRole() == RegistrationRoster.PlayerRole.player)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Outgoing player not found or not an active player"));

        RegistrationRoster incoming = rosters.stream()
                .filter(r -> r.getUser().getUserId().equals(incomingUserId) && r.getPlayerRole() == RegistrationRoster.PlayerRole.substitute)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Incoming player not found or not a substitute"));

        outgoing.setPlayerRole(RegistrationRoster.PlayerRole.substitute);
        outgoing.setIsActive(false);

        User actor = new User();
        actor.setUserId(actorId);

        incoming.setPlayerRole(RegistrationRoster.PlayerRole.player);
        incoming.setIsActive(true);
        incoming.setActivatedAt(java.time.LocalDateTime.now());
        incoming.setActivatedBy(actor);

        registrationRosterRepository.save(outgoing);
        registrationRosterRepository.save(incoming);

        // Here we could also log audit event.
        return getRegistration(registrationId, actorId); // getRegistration will rebuild DTO
    }

    private boolean isAdmin(String userId) {
        // Dummy check, real check would verify roles
        return true; 
    }

    private RegistrationDto mapToDto(Registration r) {
        int memberCount = registrationRosterRepository.findByRegistration_RegistrationId(r.getRegistrationId()).size();
        return RegistrationDto.builder()
                .registrationId(r.getRegistrationId())
                .tournamentId(r.getTournament().getTournamentId())
                .tournamentName(r.getTournament().getName())
                .tournamentSlug(r.getTournament().getSlug())
                .teamId(r.getTeam().getTeamId())
                .teamName(r.getTeam().getTeamName())
                .teamTag(r.getTeam().getTeamTag())
                .teamLogo(r.getTeam().getLogoUrl())
                .captainUserId(r.getCaptain().getUserId())
                .captainName(r.getCaptain().getDisplayName())
                .captainUsername(r.getCaptain().getUsername())
                .captainEmail(r.getCaptain().getEmail())
                .referenceNumber(r.getReferenceNumber())
                .status(r.getStatus())
                .rulesAgreed(r.getRulesAgreed())
                .flagScore(r.getFlagScore())
                .correctionNotes(r.getCorrectionNotes())
                .rejectionReason(r.getRejectionReason())
                .memberCount(memberCount)
                .createdAt(r.getCreatedAt())
                .reservationExpiresAt(r.getReservationExpiresAt())
                .isWaitlistRequest(r.getIsWaitlistRequest())
                .build();
    }
}
