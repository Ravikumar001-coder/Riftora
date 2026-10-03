package com.gameverse.modules.result.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.match.repository.MatchRepository;
import com.gameverse.modules.result.entity.MatchResult;
import com.gameverse.modules.result.entity.ScoreCorrection;
import com.gameverse.modules.result.entity.TeamMatchScore;
import com.gameverse.modules.result.repository.MatchResultRepository;
import com.gameverse.modules.result.repository.ScoreCorrectionRepository;
import com.gameverse.modules.scoring.model.ScoringTemplate;
import com.gameverse.modules.scoring.service.PointsEngineService;
import com.gameverse.core.websocket.WebSocketEventPublisher;
import org.springframework.context.ApplicationEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ResultCorrectionService {

    private final MatchResultRepository resultRepository;
    private final UserRepository userRepository;
    private final ScoreCorrectionRepository correctionRepository;
    private final PointsEngineService pointsEngineService;
    private final WebSocketEventPublisher webSocketEventPublisher;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Transactional
    public void correctScore(String resultId, String teamId, String fieldChanged, Integer oldValue, Integer newValue, String reason, String correctedByUserId) {
        MatchResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
                
        User correctedBy = userRepository.findById(correctedByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TeamMatchScore targetScore = result.getTeamScores().stream()
                .filter(ts -> ts.getTeam().getTeamId().equals(teamId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Team score not found in result"));

        // Record the correction
        ScoreCorrection correction = new ScoreCorrection();
        correction.setMatch(result.getMatch());
        correction.setTeam(targetScore.getTeam());
        correction.setFieldChanged(fieldChanged);
        correction.setOldValue(oldValue);
        correction.setNewValue(newValue);
        correction.setReason(reason);
        correction.setCorrectedBy(correctedBy);
        correctionRepository.save(correction);

        // Apply the correction
        if ("placement".equalsIgnoreCase(fieldChanged)) {
            targetScore.setPlacement(newValue);
        } else if ("kills".equalsIgnoreCase(fieldChanged) || "rawKills".equalsIgnoreCase(fieldChanged)) {
            targetScore.setRawKills(newValue);
        } else {
            throw new RuntimeException("Unsupported field correction");
        }

        // Recalculate points for all teams to ensure consistency (especially if tiebreakers or shared points are used)
        ScoringTemplate scoringTemplate = result.getMatch().getTournament().getScoringTemplate();
        if (scoringTemplate != null) {
            pointsEngineService.calculatePoints(result.getTeamScores(), scoringTemplate);
        }

        resultRepository.save(result);
        
        // FR-10-018: Trigger leaderboard and OBS updates on correction
        String tournamentId = result.getMatch().getTournament().getTournamentId();
        applicationEventPublisher.publishEvent(new com.gameverse.core.events.LeaderboardRecalculationEvent(this, tournamentId));
        webSocketEventPublisher.broadcastMatchStatus(tournamentId, "RESULT_CORRECTED:" + resultId);
    }
}
