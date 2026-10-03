package com.gameverse.modules.dispute.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.dispute.dto.CreateDisputeRequest;
import com.gameverse.modules.dispute.dto.DisputeDto;
import com.gameverse.modules.dispute.entity.Dispute;
import com.gameverse.modules.dispute.repository.DisputeRepository;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.match.repository.MatchRepository;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import com.gameverse.modules.team.entity.Team;
import com.gameverse.modules.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public DisputeDto createDispute(String userId, String tournamentId, String teamId, CreateDisputeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        // FR-20-013: Prevent a team from submitting more than 3 disputes per tournament
        int disputeCount = disputeRepository.countByTeam_TeamIdAndTournament_TournamentId(teamId, tournamentId);
        if (disputeCount >= 3) {
            throw new IllegalArgumentException("Team has reached the maximum of 3 disputes for this tournament.");
        }

        // FR-20-012: Submission window check
        validateSubmissionWindow(tournament, request);

        Dispute dispute = new Dispute();
        dispute.setTournament(tournament);
        dispute.setTeam(team);
        dispute.setSubmittedBy(user);
        
        if (request.getMatchId() != null && !request.getMatchId().trim().isEmpty()) {
            Match match = matchRepository.findById(request.getMatchId())
                    .orElseThrow(() -> new IllegalArgumentException("Match not found"));
            dispute.setMatch(match);
        }

        dispute.setCategory(request.getCategory());
        dispute.setDescription(request.getDescription());
        dispute.setRequestedResolution(request.getRequestedResolution());
        
        try {
            if (request.getEvidenceUrls() != null) {
                dispute.setEvidenceUrls(objectMapper.writeValueAsString(request.getEvidenceUrls()));
            }
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid evidenceUrls format");
        }

        // Generate Reference Number (FR-20-011)
        String shortCode = tournament.getSlug().length() > 5 ? tournament.getSlug().substring(0, 5).toUpperCase() : tournament.getSlug().toUpperCase();
        int nextSeq = tournament.getDisputeSequence() + 1;
        tournament.setDisputeSequence(nextSeq);
        tournamentRepository.save(tournament);
        
        String refNumber = String.format("DSP-%s-%04d", shortCode, nextSeq);
        dispute.setReferenceNumber(refNumber);
        dispute.setStatus(Dispute.DisputeStatus.OPEN);

        // FR-20-026: Auto-escalation for DQ Appeals
        if (request.getCategory() != null && request.getCategory().contains("Disqualification Appeal")) {
            dispute.setIsEscalated(true);
            dispute.setEscalatedAt(LocalDateTime.now());
            dispute.setIsAppealed(true);
        }

        dispute = disputeRepository.save(dispute);
        
        // FR-20-014: Notifications would be sent here.
        // notifyTournamentDirector(tournament, dispute);
        // confirmSubmissionToCaptain(user, dispute);

        return mapToDto(dispute);
    }

    private void validateSubmissionWindow(Tournament tournament, CreateDisputeRequest request) {
        String cat = request.getCategory();
        int windowMins = tournament.getDisputeSubmissionWindowMins() != null ? tournament.getDisputeSubmissionWindowMins() : 30;
        
        // Conduct violations and DQ appeals have a 48 hour window.
        // In a real scenario, we'd check against the triggering event time. For simplicity, we just enforce that
        // they can't submit if the tournament has been completed/closed for way too long.
        LocalDateTime referenceTime = LocalDateTime.now();
        if (tournament.getCompletedAt() != null) {
            if (cat.contains("Conduct") || cat.contains("Disqualification")) {
                if (tournament.getCompletedAt().plusHours(48).isBefore(referenceTime)) {
                    throw new IllegalArgumentException("Dispute submission window closed (48h max).");
                }
            } else {
                if (tournament.getCompletedAt().plusMinutes(windowMins).isBefore(referenceTime)) {
                    throw new IllegalArgumentException("Dispute submission window closed.");
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public Page<DisputeDto> getTournamentDisputes(String tournamentId, Pageable pageable) {
        return disputeRepository.findByTournament_TournamentId(tournamentId, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public Page<DisputeDto> getEscalatedDisputes(Pageable pageable) {
        return disputeRepository.findByIsEscalatedTrue(pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public DisputeDto getDisputeById(String tournamentId, String disputeId) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found"));

        if (!dispute.getTournament().getTournamentId().equals(tournamentId)) {
            throw new IllegalArgumentException("Dispute does not belong to this tournament");
        }
        return mapToDto(dispute);
    }

    @Transactional
    public DisputeDto updateDisputeStatus(String tournamentId, String disputeId, String userId, com.gameverse.modules.dispute.dto.UpdateDisputeStatusRequest request) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found"));

        if (!dispute.getTournament().getTournamentId().equals(tournamentId)) {
            throw new IllegalArgumentException("Dispute does not belong to this tournament");
        }

        User user = userRepository.findById(userId).orElseThrow();

        Dispute.DisputeStatus newStatus;
        try {
            newStatus = Dispute.DisputeStatus.valueOf(request.getStatus());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status");
        }

        dispute.setStatus(newStatus);

        boolean isResolutionState = newStatus == Dispute.DisputeStatus.RESOLVED_CORRECTION || 
                                    newStatus == Dispute.DisputeStatus.RESOLVED_NO_CHANGE || 
                                    newStatus == Dispute.DisputeStatus.DISMISSED;

        if (isResolutionState) {
            if (request.getResolutionNote() == null || request.getResolutionNote().length() < 30 || request.getResolutionNote().length() > 1000) {
                throw new IllegalArgumentException("Resolution note must be between 30 and 1000 characters for resolved states.");
            }

            com.gameverse.modules.dispute.entity.DisputeResolution resolution = dispute.getResolution();
            if (resolution == null) {
                resolution = new com.gameverse.modules.dispute.entity.DisputeResolution();
                resolution.setDispute(dispute);
            }
            resolution.setResolvedBy(user);
            resolution.setResolutionNotes(request.getResolutionNote());
            resolution.setActionTaken(newStatus.name());
            dispute.setResolution(resolution);
        }

        dispute = disputeRepository.save(dispute);

        // Notify Team Captain logic here

        return mapToDto(dispute);
    }

    @Transactional
    public DisputeDto escalateDispute(String tournamentId, String disputeId, String reason) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found"));

        if (!dispute.getTournament().getTournamentId().equals(tournamentId)) {
            throw new IllegalArgumentException("Dispute does not belong to this tournament");
        }

        if (dispute.getIsEscalated() != null && dispute.getIsEscalated()) {
            throw new IllegalArgumentException("Dispute is already escalated");
        }

        dispute.setIsEscalated(true);
        dispute.setEscalatedAt(LocalDateTime.now());
        
        // Add audit trail logging for escalation here (FR-20-020/021)
        
        dispute = disputeRepository.save(dispute);
        return mapToDto(dispute);
    }

    @Transactional
    public DisputeDto appealDispute(String tournamentId, String disputeId, String reason) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found"));

        if (!dispute.getTournament().getTournamentId().equals(tournamentId)) {
            throw new IllegalArgumentException("Dispute does not belong to this tournament");
        }

        if (dispute.getIsAppealed() != null && dispute.getIsAppealed()) {
            throw new IllegalArgumentException("Dispute has already been appealed once");
        }

        // FR-20-024: Can only appeal resolved disputes
        if (dispute.getStatus() != Dispute.DisputeStatus.RESOLVED_CORRECTION && 
            dispute.getStatus() != Dispute.DisputeStatus.RESOLVED_NO_CHANGE &&
            dispute.getStatus() != Dispute.DisputeStatus.DISMISSED) {
            throw new IllegalArgumentException("Can only appeal a resolved dispute");
        }

        dispute.setIsAppealed(true);
        dispute.setIsEscalated(true);
        dispute.setEscalatedAt(LocalDateTime.now());
        
        // Audit log action goes here
        
        dispute = disputeRepository.save(dispute);
        return mapToDto(dispute);
    }

    @Transactional
    public DisputeDto resolveEscalatedDispute(String disputeId, String userId, com.gameverse.modules.dispute.dto.UpdateDisputeStatusRequest request) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new IllegalArgumentException("Dispute not found"));

        if (dispute.getIsEscalated() == null || !dispute.getIsEscalated()) {
            throw new IllegalArgumentException("Dispute is not escalated");
        }

        User user = userRepository.findById(userId).orElseThrow();

        Dispute.DisputeStatus newStatus;
        try {
            newStatus = Dispute.DisputeStatus.valueOf(request.getStatus());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status");
        }

        dispute.setStatus(newStatus);
        
        com.gameverse.modules.dispute.entity.DisputeResolution resolution = dispute.getResolution();
        if (resolution == null) {
            resolution = new com.gameverse.modules.dispute.entity.DisputeResolution();
            resolution.setDispute(dispute);
            resolution.setResolvedBy(user);
        }
        
        resolution.setSuperAdminOverride(true);
        resolution.setSuperAdminResolvedBy(user);
        resolution.setSuperAdminResolvedAt(LocalDateTime.now());
        resolution.setSuperAdminNotes(request.getResolutionNote());
        resolution.setActionTaken(newStatus.name());

        dispute.setResolution(resolution);
        dispute.setIsEscalated(false); // Clear escalation flag as it's resolved

        dispute = disputeRepository.save(dispute);

        // FR-20-023 actions (warning, ban, cancellation) would be dispatched here
        // FR-20-027 DQ logic would be dispatched here

        return mapToDto(dispute);
    }

    private DisputeDto mapToDto(Dispute d) {
        DisputeDto dto = new DisputeDto();
        dto.setDisputeId(d.getDisputeId());
        dto.setReferenceNumber(d.getReferenceNumber());
        if (d.getMatch() != null) {
            dto.setMatchId(d.getMatch().getMatchId());
        }
        dto.setTournamentId(d.getTournament().getTournamentId());
        if (d.getTeam() != null) {
            dto.setTeamId(d.getTeam().getTeamId());
            dto.setTeamName(d.getTeam().getTeamName());
        }
        dto.setSubmittedByUserId(d.getSubmittedBy().getUserId());
        dto.setCategory(d.getCategory());
        dto.setDescription(d.getDescription());
        dto.setRequestedResolution(d.getRequestedResolution());
        
        try {
            if (d.getEvidenceUrls() != null) {
                dto.setEvidenceUrls(objectMapper.readTree(d.getEvidenceUrls()));
            }
        } catch (JsonProcessingException e) {
            dto.setEvidenceUrls(d.getEvidenceUrls());
        }
        
        dto.setStatus(d.getStatus().name());
        if (d.getResolution() != null) {
            dto.setResolutionNote(d.getResolution().getResolutionNotes());
        }
        dto.setPriorityLevel(calculatePriority(d));
        dto.setIsEscalated(d.getIsEscalated());
        dto.setEscalatedAt(d.getEscalatedAt());
        dto.setIsAppealed(d.getIsAppealed());
        if (d.getResolution() != null) {
            dto.setSuperAdminOverride(d.getResolution().getSuperAdminOverride());
            dto.setSuperAdminNotes(d.getResolution().getSuperAdminNotes());
        }
        dto.setCreatedAt(d.getCreatedAt());
        dto.setUpdatedAt(d.getUpdatedAt());
        return dto;
    }

    private String calculatePriority(Dispute d) {
        // FR-20-016
        String cat = d.getCategory() != null ? d.getCategory() : "";
        
        if (cat.contains("Disqualification") || cat.contains("Credential") || cat.contains("Unauthorized")) {
            return "Critical";
        } else if (cat.contains("Kill Count") || cat.contains("Placement")) {
            return "High";
        }
        return "Normal";
    }
}
