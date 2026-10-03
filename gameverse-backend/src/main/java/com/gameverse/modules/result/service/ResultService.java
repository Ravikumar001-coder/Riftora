package com.gameverse.modules.result.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.match.repository.MatchRepository;
import com.gameverse.modules.result.dto.MatchResultDto;
import com.gameverse.modules.result.dto.SubmitResultRequest;
import com.gameverse.modules.result.entity.MatchResult;
import com.gameverse.modules.result.entity.PlayerMatchScore;
import com.gameverse.modules.result.entity.TeamMatchScore;
import com.gameverse.modules.result.repository.MatchResultRepository;
import com.gameverse.modules.scoring.model.ScoringTemplate;
import com.gameverse.modules.scoring.service.PointsEngineService;
import com.gameverse.modules.team.entity.Team;
import com.gameverse.modules.team.repository.TeamRepository;
import com.gameverse.modules.result.repository.ResultDisputeRepository;
import com.gameverse.modules.result.entity.ResultDispute;
import com.gameverse.core.websocket.WebSocketEventPublisher;
import org.springframework.context.ApplicationEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final MatchResultRepository resultRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final PointsEngineService pointsEngineService;
    private final WebSocketEventPublisher webSocketEventPublisher;
    private final ResultDisputeRepository disputeRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Transactional
    public MatchResultDto submitResult(String userId, SubmitResultRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (resultRepository.findByMatch_MatchId(match.getMatchId()).isPresent()) {
            throw new RuntimeException("Result already submitted for this match");
        }

        MatchResult result = new MatchResult();
        result.setMatch(match);
        result.setSubmittedBy(user);
        result.setScreenshotUrl(request.getScreenshotUrl());
        
        if (Boolean.TRUE.equals(request.getIsDraft())) {
            result.setIsDraft(true);
            result.setStatus(MatchResult.ResultStatus.pending); 
        } else {
            result.setIsDraft(false);
            
            // FR-10-013: Check publication mode
            if (match.getTournament().getResultPublicationMode() == com.gameverse.modules.tournament.entity.Tournament.PublicationMode.auto_publish) {
                result.setStatus(MatchResult.ResultStatus.verified);
                result.setVerifiedAt(java.time.LocalDateTime.now());
                result.setVerifiedBy(user); // Auto-verified by the submitter
            } else {
                result.setStatus(MatchResult.ResultStatus.pending); // pending director verification
                
                // FR-10-014: Notify Director
                webSocketEventPublisher.broadcastCommandCenterUpdate(
                    match.getTournament().getTournamentId(), 
                    "New results pending verification for match: " + match.getMatchId()
                );
            }
        }

        int totalKills = 0;
        int maxKillsByOneTeam = 0;
        int firstPlaceKills = -1;

        if (request.getTeamScores() != null) {
            for (SubmitResultRequest.TeamScoreRequest tsReq : request.getTeamScores()) {
                Team team = teamRepository.findById(tsReq.getTeamId())
                        .orElseThrow(() -> new RuntimeException("Team not found"));

                TeamMatchScore tms = new TeamMatchScore();
                tms.setMatchResult(result);
                tms.setTeam(team);
                tms.setPlacement(tsReq.getPlacement() != null ? tsReq.getPlacement() : 0);
                
                int rawKills = tsReq.getRawKills() != null ? tsReq.getRawKills() : 0;
                tms.setRawKills(rawKills);
                
                totalKills += rawKills;
                if (rawKills > maxKillsByOneTeam) maxKillsByOneTeam = rawKills;
                if (tms.getPlacement() == 1) firstPlaceKills = rawKills;
                
                tms.setIsChickenDinner(tsReq.getIsChickenDinner() != null ? tsReq.getIsChickenDinner() : false);
                tms.setGotFirstBlood(tsReq.getGotFirstBlood() != null ? tsReq.getGotFirstBlood() : false);
                tms.setTeamWipes(tsReq.getTeamWipes() != null ? tsReq.getTeamWipes() : 0);
                tms.setGotMvp(tsReq.getGotMvp() != null ? tsReq.getGotMvp() : false);
                tms.setGotWinnerBonus(tsReq.getGotWinnerBonus() != null ? tsReq.getGotWinnerBonus() : false);
                
                // Set default points to zero, engine will calculate them
                tms.setPlacementPoints(java.math.BigDecimal.ZERO);
                tms.setKillPoints(java.math.BigDecimal.ZERO);
                tms.setBonusPoints(java.math.BigDecimal.ZERO);
                tms.setTotalPoints(java.math.BigDecimal.ZERO);
                
                if (tsReq.getPlayerScores() != null) {
                    for (SubmitResultRequest.PlayerScoreRequest psReq : tsReq.getPlayerScores()) {
                        User player = userRepository.findById(psReq.getUserId())
                                .orElseThrow(() -> new RuntimeException("Player user not found"));

                        PlayerMatchScore pms = new PlayerMatchScore();
                        pms.setTeamMatchScore(tms);
                        pms.setUser(player);
                        pms.setKills(psReq.getKills() != null ? psReq.getKills() : 0);
                        pms.setAssists(psReq.getAssists() != null ? psReq.getAssists() : 0);
                        pms.setDamage(psReq.getDamage());
                        
                        tms.getPlayerScores().add(pms);
                    }
                }
                
                result.getTeamScores().add(tms);
            }
        }
        
        // FR-10-024: Anomaly Detection
        if (!Boolean.TRUE.equals(request.getIsDraft())) {
            List<String> anomalies = new ArrayList<>();
            if (totalKills > 0 && maxKillsByOneTeam > (totalKills * 0.5)) {
                anomalies.add("A single team has > 50% of all kills in the match.");
            }
            if (totalKills > 100) { // Assuming 100 is theoretical max
                anomalies.add("Total kills (" + totalKills + ") exceeds the theoretical maximum (100).");
            }
            if (firstPlaceKills == 0) {
                anomalies.add("First-place team has 0 kills.");
            }
            result.setAnomalies(anomalies);
        }

        ScoringTemplate scoringTemplate = match.getTournament().getScoringTemplate();
        if (scoringTemplate != null) {
            pointsEngineService.calculatePoints(result.getTeamScores(), scoringTemplate);
        }

        result = resultRepository.save(result);
        return mapToDto(result);
    }

    private MatchResultDto mapToDto(MatchResult r) {
        return MatchResultDto.builder()
                .resultId(r.getResultId())
                .matchId(r.getMatch().getMatchId())
                .submittedByUserId(r.getSubmittedBy().getUserId())
                .status(r.getStatus())
                .verifiedByUserId(r.getVerifiedBy() != null ? r.getVerifiedBy().getUserId() : null)
                .verifiedAt(r.getVerifiedAt())
                .build();
    }

    @Transactional
    public void verifyResult(String resultId, String userId, String statusStr) {
        MatchResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        MatchResult.ResultStatus status = MatchResult.ResultStatus.valueOf(statusStr.toLowerCase());
        
        result.setStatus(status);
        if (status == MatchResult.ResultStatus.verified) {
            result.setVerifiedBy(user);
            result.setVerifiedAt(java.time.LocalDateTime.now());
            
            // FR-10-016: Trigger leaderboard and OBS updates
            String tournamentId = result.getMatch().getTournament().getTournamentId();
            applicationEventPublisher.publishEvent(new com.gameverse.core.events.LeaderboardRecalculationEvent(this, tournamentId));
            webSocketEventPublisher.broadcastMatchStatus(tournamentId, "RESULT_PUBLISHED:" + resultId);
        }
        
        
        resultRepository.save(result);
    }

    @Transactional
    public void voidMatch(String resultId) {
        MatchResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        
        result.setStatus(MatchResult.ResultStatus.voided);
        resultRepository.save(result);
        
        String tournamentId = result.getMatch().getTournament().getTournamentId();
        applicationEventPublisher.publishEvent(new com.gameverse.core.events.LeaderboardRecalculationEvent(this, tournamentId));
        webSocketEventPublisher.broadcastMatchStatus(tournamentId, "RESULT_VOIDED:" + resultId);
    }

    @Transactional
    public void disqualifyTeam(String resultId, String teamId, String reason) {
        MatchResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        
        TeamMatchScore targetScore = result.getTeamScores().stream()
                .filter(ts -> ts.getTeam().getTeamId().equals(teamId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Team score not found in result"));

        targetScore.setIsDisqualified(true);
        targetScore.setDqReason(reason);
        targetScore.setPlacementPoints(java.math.BigDecimal.ZERO);
        targetScore.setKillPoints(java.math.BigDecimal.ZERO);
        targetScore.setTotalPoints(java.math.BigDecimal.ZERO);
        targetScore.setBonusPoints(java.math.BigDecimal.ZERO);

        resultRepository.save(result);

        String tournamentId = result.getMatch().getTournament().getTournamentId();
        applicationEventPublisher.publishEvent(new com.gameverse.core.events.LeaderboardRecalculationEvent(this, tournamentId));
        webSocketEventPublisher.broadcastMatchStatus(tournamentId, "TEAM_DISQUALIFIED:" + resultId + ":" + teamId);
    }

    @Transactional
    public void raiseDispute(String resultId, String userId, String teamId, Integer claimedPlacement, Integer claimedKills, String evidenceUrl) {
        MatchResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // FR-10-023: Enforce 30 minute window
        if (result.getVerifiedAt() != null && java.time.LocalDateTime.now().isAfter(result.getVerifiedAt().plusMinutes(30))) {
            throw new RuntimeException("Dispute window has closed for this match (30 minutes).");
        }
        
        ResultDispute dispute = new ResultDispute();
        dispute.setMatchResult(result);
        dispute.setTeam(team);
        dispute.setSubmittedBy(user);
        dispute.setClaimedPlacement(claimedPlacement);
        dispute.setClaimedKills(claimedKills);
        dispute.setEvidenceUrl(evidenceUrl);
        disputeRepository.save(dispute);
        
        result.setStatus(MatchResult.ResultStatus.disputed);
        resultRepository.save(result);
        
        // FR-10-022: Notify Director
        String tournamentId = result.getMatch().getTournament().getTournamentId();
        webSocketEventPublisher.broadcastCommandCenterUpdate(
            tournamentId, 
            "Result Disputed for match: " + result.getMatch().getMatchId()
        );
    }
}
