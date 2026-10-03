package com.gameverse.modules.scoring.service;

import com.gameverse.modules.result.entity.TeamMatchScore;
import com.gameverse.modules.scoring.model.PlacementPoint;
import com.gameverse.modules.scoring.model.ScoringTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class PointsEngineService {

    /**
     * Calculates points for a list of TeamMatchScores based on the provided ScoringTemplate.
     * Updates the score instances in-place.
     */
    public void calculatePoints(List<TeamMatchScore> teamScores, ScoringTemplate template) {
        if (template == null) {
            throw new IllegalArgumentException("ScoringTemplate is required for points calculation.");
        }

        Map<Integer, BigDecimal> placementPointsMap = template.getPlacementPoints().stream()
                .collect(Collectors.toMap(PlacementPoint::getPlacement, PlacementPoint::getPoints));

        for (TeamMatchScore score : teamScores) {
            // 1. Placement Points
            BigDecimal pPoints = placementPointsMap.getOrDefault(score.getPlacement(), BigDecimal.ZERO);
            score.setPlacementPoints(pPoints);

            // 2. Kill Cap and Kill Points
            int rawKills = score.getRawKills() != null ? score.getRawKills() : 0;
            int effectiveKills = rawKills;
            
            if (template.getKillCap() != null && effectiveKills > template.getKillCap()) {
                effectiveKills = template.getKillCap();
            }
            score.setEffectiveKills(effectiveKills);

            BigDecimal killValue = template.getKillPtsEach() != null ? template.getKillPtsEach() : BigDecimal.ZERO;
            BigDecimal kPoints = killValue.multiply(BigDecimal.valueOf(effectiveKills));
            score.setKillPoints(kPoints);

            // 3. Bonus Points
            BigDecimal bPoints = BigDecimal.ZERO;
            
            if (Boolean.TRUE.equals(score.getGotFirstBlood()) && template.getFirstBloodPts() != null) {
                bPoints = bPoints.add(template.getFirstBloodPts());
            }
            if (score.getTeamWipes() != null && score.getTeamWipes() > 0 && template.getTeamWipePts() != null) {
                bPoints = bPoints.add(template.getTeamWipePts().multiply(BigDecimal.valueOf(score.getTeamWipes())));
            }
            if (Boolean.TRUE.equals(score.getGotMvp()) && template.getMvpPts() != null) {
                bPoints = bPoints.add(template.getMvpPts());
            }
            if (Boolean.TRUE.equals(score.getGotWinnerBonus()) && template.getWinnerBonusPts() != null) {
                bPoints = bPoints.add(template.getWinnerBonusPts());
            }
            
            score.setBonusPoints(bPoints);

            // 4. Total Points
            BigDecimal tPoints = pPoints.add(kPoints).add(bPoints);
            score.setTotalPoints(tPoints);
        }
    }
}
