package com.gameverse.modules.match.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.dto.CreateMatchRequest;
import com.gameverse.modules.match.dto.MatchDto;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.match.repository.MatchRepository;
import com.gameverse.modules.match.repository.MatchNoteRepository;
import com.gameverse.modules.match.entity.MatchNote;
import com.gameverse.modules.match.repository.MatchSlotRepository;
import com.gameverse.modules.audit.service.AuditLogService;
import com.gameverse.modules.broadcast.service.YoutubeIntegrationService;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import com.gameverse.modules.registration.repository.RegistrationRepository;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.match.dto.DelayMatchRequest;
import com.gameverse.modules.match.dto.NoShowRequest;
import com.gameverse.core.websocket.WebSocketEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchNoteRepository matchNoteRepository;
    private final MatchSlotRepository matchSlotRepository;
    private final TournamentRepository tournamentRepository;
    private final AuditLogService auditLogService;
    private final RegistrationRepository registrationRepository;
    private final WebSocketEventPublisher webSocketEventPublisher;
    private final YoutubeIntegrationService youtubeIntegrationService;

    @Transactional
    public MatchDto createMatch(CreateMatchRequest request) {
        Tournament tournament = tournamentRepository.findById(request.getTournamentId())
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (matchRepository.findByTournament_TournamentIdAndMatchNumber(tournament.getTournamentId(), request.getMatchNumber()).isPresent()) {
            throw new RuntimeException("Match number already exists in this tournament");
        }

        Match match = new Match();
        match.setTournament(tournament);
        match.setMatchNumber(request.getMatchNumber());
        match.setRoundNumber(request.getRoundNumber());
        match.setMatchLabel(request.getMatchLabel());
        match.setScheduledStart(request.getScheduledStart());

        match = matchRepository.save(match);

        return mapToDto(match);
    }

    @Transactional
    public MatchDto assignReferee(String matchId, String refereeId, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
                
        User referee = new User();
        referee.setUserId(refereeId);
        
        match.setAssignedReferee(referee);
        match = matchRepository.save(match);
        
        auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "MATCH_REFEREE_ASSIGNED", "{\"refereeUserId\": \"" + refereeId + "\"}");
        
        return mapToDto(match);
    }

    @Transactional
    public MatchDto updateMatchSchedule(String matchId, java.time.LocalDateTime scheduledStart, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setScheduledStart(scheduledStart);
        match = matchRepository.save(match);

        auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "MATCH_SCHEDULE_UPDATED", "{\"scheduledStart\": \"" + scheduledStart + "\"}");

        return mapToDto(match);
    }

    @Transactional
    public java.util.List<MatchDto> batchUpdateSchedule(com.gameverse.modules.match.dto.BatchScheduleMatchesRequest request, String actorId) {
        java.util.List<MatchDto> updatedMatches = new java.util.ArrayList<>();
        
        for (com.gameverse.modules.match.dto.UpdateMatchScheduleRequest updateReq : request.getMatches()) {
            updatedMatches.add(updateMatchSchedule(updateReq.getMatchId(), updateReq.getScheduledStart(), actorId));
        }
        
        return updatedMatches;
    }

    @Transactional(readOnly = true)
    public java.util.List<MatchDto> getMatchesByTournament(String tournamentId) {
        return matchRepository.findByTournament_TournamentIdOrderByScheduledStartAsc(tournamentId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public java.util.List<MatchDto> getPlayerMatchesByTournament(String tournamentId, String userId) {
        // Find the user's team for this tournament
        java.util.List<Registration> userRegistrations = registrationRepository.findByTournament_TournamentId(
            tournamentId, org.springframework.data.domain.Pageable.unpaged()
        ).getContent().stream()
         .filter(r -> r.getCaptain().getUserId().equals(userId))
         .toList();

        if (userRegistrations.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        String teamId = userRegistrations.get(0).getTeam().getTeamId();

        // Get all matches for this tournament
        java.util.List<Match> allMatches = matchRepository.findByTournament_TournamentIdOrderByScheduledStartAsc(tournamentId);

        // Filter matches where this team has a slot
        return allMatches.stream()
                .filter(m -> {
                    java.util.List<com.gameverse.modules.match.entity.MatchSlot> slots = matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(m.getMatchId());
                    return slots.stream().anyMatch(s -> s.getTeam() != null && s.getTeam().getTeamId().equals(teamId));
                })
                .map(this::mapToDto)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public java.util.List<com.gameverse.modules.match.entity.MatchSlot> getMatchSlots(String matchId) {
        return matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(matchId);
    }
    
    @Transactional
    public MatchDto updateMatchSlots(String matchId, com.gameverse.modules.match.dto.UpdateMatchSlotsRequest request, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        java.util.List<com.gameverse.modules.match.entity.MatchSlot> existingSlots = matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(matchId);

        for (com.gameverse.modules.match.dto.MatchSlotUpdateDto slotUpdate : request.getSlots()) {
            com.gameverse.modules.match.entity.MatchSlot slot = existingSlots.stream()
                .filter(s -> s.getSlotNumber().equals(slotUpdate.getSlotNumber()))
                .findFirst()
                .orElseGet(() -> {
                    com.gameverse.modules.match.entity.MatchSlot newSlot = new com.gameverse.modules.match.entity.MatchSlot();
                    newSlot.setMatch(match);
                    newSlot.setSlotNumber(slotUpdate.getSlotNumber());
                    return newSlot;
                });

            if (slotUpdate.getTeamId() != null && !slotUpdate.getTeamId().isEmpty()) {
                com.gameverse.modules.team.entity.Team team = new com.gameverse.modules.team.entity.Team();
                team.setTeamId(slotUpdate.getTeamId());
                slot.setTeam(team);
            } else {
                slot.setTeam(null);
            }
            
            if (slotUpdate.getSlotLabel() != null) {
                slot.setSlotLabel(slotUpdate.getSlotLabel());
            }

            matchSlotRepository.save(slot);
        }

        auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "MATCH_SLOTS_UPDATED", "{}");
        
        return mapToDto(match);
    }

    @Transactional
    public MatchDto delayMatch(String matchId, DelayMatchRequest request, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setScheduledStart(match.getScheduledStart().plusMinutes(request.getDelayMinutes()));
        match = matchRepository.save(match);

        auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "MATCH_DELAYED", "{\"delayMinutes\": " + request.getDelayMinutes() + "}");

        // Notify teams
        java.util.List<com.gameverse.modules.match.entity.MatchSlot> slots = matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(matchId);
        String payload = String.format("{\"matchId\":\"%s\", \"delayMinutes\":%d, \"message\":\"Match delayed by %d minutes. New start time: %s\"}", 
                match.getMatchId(), request.getDelayMinutes(), request.getDelayMinutes(), match.getScheduledStart().toString());

        for (com.gameverse.modules.match.entity.MatchSlot slot : slots) {
            if (slot.getRegistration() != null && slot.getRegistration().getCaptain() != null) {
                webSocketEventPublisher.sendToUserQueue(slot.getRegistration().getCaptain().getUserId(), "/queue/notifications", payload);
            }
        }

        return mapToDto(match);
    }

    @Transactional
    public MatchDto handleNoShow(String matchId, NoShowRequest request, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if ("MERGE".equalsIgnoreCase(request.getAction())) {
            // Complex logic simplified: Move all active slots from targetMatch to this match
            if (request.getTargetMatchId() == null) {
                throw new RuntimeException("Target Match ID is required for MERGE action");
            }
            java.util.List<com.gameverse.modules.match.entity.MatchSlot> sourceSlots = matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(request.getTargetMatchId());
            java.util.List<com.gameverse.modules.match.entity.MatchSlot> targetSlots = matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(matchId);
            
            // Find next available slot numbers
            int nextSlotNum = targetSlots.stream().mapToInt(com.gameverse.modules.match.entity.MatchSlot::getSlotNumber).max().orElse(0) + 1;
            
            for (com.gameverse.modules.match.entity.MatchSlot sourceSlot : sourceSlots) {
                if (sourceSlot.getTeam() != null && !Boolean.TRUE.equals(sourceSlot.getNoShow())) {
                    sourceSlot.setMatch(match);
                    sourceSlot.setSlotNumber(nextSlotNum++);
                    matchSlotRepository.save(sourceSlot);
                }
            }
            
            auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "MATCHES_MERGED", "{\"sourceMatchId\": \"" + request.getTargetMatchId() + "\"}");
            return mapToDto(match);
        }

        java.util.List<com.gameverse.modules.match.entity.MatchSlot> slots = matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(matchId);
        com.gameverse.modules.match.entity.MatchSlot slotToUpdate = slots.stream()
                .filter(s -> s.getTeam() != null && s.getTeam().getTeamId().equals(request.getTeamId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Team not found in this match"));

        if ("REMOVE".equalsIgnoreCase(request.getAction())) {
            slotToUpdate.setNoShow(true);
            slotToUpdate.setNoShowAt(java.time.LocalDateTime.now());
            // Optionally remove team from slot, or just leave marked as no-show
            matchSlotRepository.save(slotToUpdate);
            auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "NO_SHOW_REMOVED", "{\"teamId\": \"" + request.getTeamId() + "\"}");

        } else if ("REPLACE_WAITLIST".equalsIgnoreCase(request.getAction())) {
            // Find oldest waitlisted registration
            org.springframework.data.domain.Pageable limitOne = org.springframework.data.domain.PageRequest.of(0, 1, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "createdAt"));
            java.util.List<Registration> waitlisted = registrationRepository.findByTournament_TournamentId(match.getTournament().getTournamentId(), limitOne).getContent().stream()
                .filter(r -> r.getStatus() == Registration.RegistrationStatus.waitlisted)
                .toList();

            if (waitlisted.isEmpty()) {
                throw new RuntimeException("No waitlisted teams available");
            }

            Registration replacement = waitlisted.get(0);
            replacement.setStatus(Registration.RegistrationStatus.approved);
            replacement.setApprovedAt(java.time.LocalDateTime.now());
            User systemUser = new User();
            systemUser.setUserId(actorId); // assume actor is the user
            replacement.setApprovedBy(systemUser);
            registrationRepository.save(replacement);

            // Mark old slot as no-show
            slotToUpdate.setNoShow(true);
            slotToUpdate.setNoShowAt(java.time.LocalDateTime.now());
            matchSlotRepository.save(slotToUpdate);

            // Create new slot for replacement
            com.gameverse.modules.match.entity.MatchSlot newSlot = new com.gameverse.modules.match.entity.MatchSlot();
            newSlot.setMatch(match);
            newSlot.setSlotNumber(slotToUpdate.getSlotNumber()); // Take the same slot number
            newSlot.setTeam(replacement.getTeam());
            newSlot.setRegistration(replacement);
            newSlot.setSlotLabel(slotToUpdate.getSlotLabel());
            matchSlotRepository.save(newSlot);

            auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "NO_SHOW_REPLACED", "{\"oldTeamId\": \"" + request.getTeamId() + "\", \"newTeamId\": \"" + replacement.getTeam().getTeamId() + "\"}");
            
            if (replacement.getCaptain() != null) {
                String payload = String.format("{\"matchId\":\"%s\", \"message\":\"Your waitlisted team has been assigned to a match due to a no-show!\"}", match.getMatchId());
                webSocketEventPublisher.sendToUserQueue(replacement.getCaptain().getUserId(), "/queue/notifications", payload);
            }
        } else {
            throw new RuntimeException("Invalid action: " + request.getAction());
        }

        return mapToDto(match);
    }

    @Transactional
    public MatchDto updateMatchStatus(String matchId, Match.MatchStatus status, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setStatus(status);
        if (status == Match.MatchStatus.in_progress && match.getActualStart() == null) {
            match.setActualStart(java.time.LocalDateTime.now());
            
            try {
                youtubeIntegrationService.updateStreamTitleForMatchStart(
                    match.getTournament().getOrganization().getOrgId(),
                    match.getTournament().getName(),
                    match.getMatchNumber(),
                    match.getRoundNumber()
                );
            } catch (Exception e) {
                System.err.println("Failed to update YouTube stream title: " + e.getMessage());
            }
        } else if (status == Match.MatchStatus.completed && match.getActualEnd() == null) {
            match.setActualEnd(java.time.LocalDateTime.now());
        }

        match = matchRepository.save(match);

        auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "MATCH_STATUS_UPDATED", "{\"status\": \"" + status + "\"}");

        MatchDto dto = mapToDto(match);

        try {
            webSocketEventPublisher.broadcastMatchStatus(match.getTournament().getTournamentId(), dto);
        } catch (Exception e) {
            System.err.println("Failed to broadcast MatchDto for STOMP: " + e.getMessage());
        }

        return dto;
    }

    @Transactional
    public MatchDto voidMatch(String matchId, String reason, boolean scheduleRematch, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setStatus(Match.MatchStatus.voided);
        match.setVoidReason(reason);
        User systemUser = new User();
        systemUser.setUserId(actorId);
        match.setVoidedBy(systemUser);
        match.setVoidedAt(java.time.LocalDateTime.now());
        match = matchRepository.save(match);

        auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "MATCH_VOIDED", "{\"reason\": \"" + reason + "\"}");

        if (scheduleRematch) {
            Match rematch = new Match();
            rematch.setTournament(match.getTournament());
            rematch.setMatchNumber(match.getMatchNumber() + 100); // Dummy generation
            rematch.setRoundNumber(match.getRoundNumber());
            rematch.setMatchLabel(match.getMatchLabel() != null ? match.getMatchLabel() + " (Rematch)" : "Rematch");
            rematch.setScheduledStart(java.time.LocalDateTime.now().plusHours(1)); // Schedule 1 hour from now
            rematch.setStatus(Match.MatchStatus.scheduled);
            final Match savedRematch = matchRepository.save(rematch);

            java.util.List<com.gameverse.modules.match.entity.MatchSlot> existingSlots = matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(matchId);
            existingSlots.forEach(s -> {
                com.gameverse.modules.match.entity.MatchSlot newSlot = new com.gameverse.modules.match.entity.MatchSlot();
                newSlot.setMatch(savedRematch);
                newSlot.setTeam(s.getTeam());
                newSlot.setRegistration(s.getRegistration());
                newSlot.setSlotNumber(s.getSlotNumber());
                newSlot.setSlotLabel(s.getSlotLabel());
                matchSlotRepository.save(newSlot);
            });
            
            auditLogService.logAction(actorId, match.getTournament().getTournamentId(), savedRematch.getMatchId(), "match", "REMATCH_SCHEDULED", "{\"originalMatchId\": \"" + match.getMatchId() + "\"}");
        }

        MatchDto dto = mapToDto(match);
        try {
            webSocketEventPublisher.broadcastMatchStatus(match.getTournament().getTournamentId(), dto);
        } catch (Exception e) {
            System.err.println("Failed to broadcast MatchDto for STOMP: " + e.getMessage());
        }
        return dto;
    }

    @Transactional
    public MatchNote addMatchNote(String matchId, String content, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        User actor = new User();
        actor.setUserId(actorId);

        MatchNote note = new MatchNote();
        note.setMatch(match);
        note.setAuthor(actor);
        note.setContent(content);

        return matchNoteRepository.save(note);
    }

    @Transactional(readOnly = true)
    public java.util.List<MatchNote> getMatchNotes(String matchId) {
        return matchNoteRepository.findByMatch_MatchIdOrderByCreatedAtDesc(matchId);
    }

    @Transactional
    public MatchDto linkVod(String matchId, com.gameverse.modules.match.dto.VodLinkRequest request, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setVodUrl(request.getVodUrl());
        match.setVodTimestampSeconds(request.getVodTimestampSeconds());
        
        match = matchRepository.save(match);
        
        auditLogService.logAction(actorId, match.getTournament().getTournamentId(), match.getMatchId(), "match", "VOD_LINKED", "{\"vodUrl\": \"" + request.getVodUrl() + "\"}");
        
        return mapToDto(match);
    }

    private MatchDto mapToDto(Match m) {
        java.util.List<com.gameverse.modules.match.entity.MatchSlot> slots = matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(m.getMatchId());
        
        java.util.List<com.gameverse.modules.match.dto.MatchSlotDto> slotDtos = slots.stream()
            .map(s -> com.gameverse.modules.match.dto.MatchSlotDto.builder()
                .slotId(s.getSlotId())
                .matchId(s.getMatch().getMatchId())
                .registrationId(s.getRegistration() != null ? s.getRegistration().getRegistrationId() : null)
                .teamId(s.getTeam() != null ? s.getTeam().getTeamId() : null)
                .teamName(s.getTeam() != null ? s.getTeam().getTeamName() : null)
                .slotNumber(s.getSlotNumber())
                .isBye(s.getIsBye())
                .noShow(s.getNoShow())
                .noShowAt(s.getNoShowAt())
                .slotLabel(s.getSlotLabel())
                .build()
            )
            .toList();

        return MatchDto.builder()
                .matchId(m.getMatchId())
                .tournamentId(m.getTournament().getTournamentId())
                .assignedRefereeId(m.getAssignedReferee() != null ? m.getAssignedReferee().getUserId() : null)
                .matchNumber(m.getMatchNumber())
                .roundNumber(m.getRoundNumber())
                .matchLabel(m.getMatchLabel())
                .scheduledStart(m.getScheduledStart())
                .actualStart(m.getActualStart())
                .actualEnd(m.getActualEnd())
                .status(m.getStatus())
                .slots(slotDtos)
                .vodUrl(m.getVodUrl())
                .vodTimestampSeconds(m.getVodTimestampSeconds())
                .build();
    }
}
