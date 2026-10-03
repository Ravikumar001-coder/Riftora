package com.gameverse.modules.scoring.service;

import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.game.repository.GameRepository;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import com.gameverse.modules.scoring.dto.ScoringTemplateDto;
import com.gameverse.modules.scoring.dto.ScoringTemplateRequest;
import com.gameverse.modules.scoring.dto.SimulateScoringRequest;
import com.gameverse.modules.scoring.dto.SimulatedStanding;
import com.gameverse.modules.scoring.model.PlacementPoint;
import com.gameverse.modules.scoring.model.ScoringTemplate;
import com.gameverse.modules.scoring.repository.ScoringTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScoringTemplateService {

    private final ScoringTemplateRepository scoringTemplateRepository;
    private final GameRepository gameRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional(readOnly = true)
    public List<ScoringTemplateDto> getTemplatesForOrg(String orgId) {
        return scoringTemplateRepository.findByOrganization_OrgIdOrIsSystemTemplateTrue(orgId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScoringTemplateDto createTemplate(String orgId, ScoringTemplateRequest request) {
        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new IllegalArgumentException("Game not found"));

        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        ScoringTemplate template = new ScoringTemplate();
        template.setGame(game);
        template.setOrganization(org);
        template.setTemplateName(request.getTemplateName());
        template.setKillCap(request.getKillCap());
        template.setKillPtsEach(request.getKillPtsEach());
        template.setFirstBloodPts(request.getFirstBloodPts());
        template.setTeamWipePts(request.getTeamWipePts());
        template.setMvpPts(request.getMvpPts());
        template.setWinnerBonusPts(request.getWinnerBonusPts());
        template.setTiebreakerSeq(request.getTiebreakerSeq());
        template.setSystemTemplate(false);

        // Map placement points
        updatePlacementPoints(template, request.getPlacementPoints());

        ScoringTemplate saved = scoringTemplateRepository.save(template);
        return mapToDto(saved);
    }

    @Transactional
    public ScoringTemplateDto updateTemplate(String orgId, String templateId, ScoringTemplateRequest request) {
        ScoringTemplate template = scoringTemplateRepository.findByIdAndOrganization_OrgId(templateId, orgId)
                .orElseThrow(() -> new IllegalArgumentException("Template not found or access denied"));

        if (template.isSystemTemplate()) {
            throw new IllegalArgumentException("System templates cannot be edited");
        }

        template.setTemplateName(request.getTemplateName());
        template.setKillCap(request.getKillCap());
        template.setKillPtsEach(request.getKillPtsEach());
        template.setFirstBloodPts(request.getFirstBloodPts());
        template.setTeamWipePts(request.getTeamWipePts());
        template.setMvpPts(request.getMvpPts());
        template.setWinnerBonusPts(request.getWinnerBonusPts());
        template.setTiebreakerSeq(request.getTiebreakerSeq());

        updatePlacementPoints(template, request.getPlacementPoints());

        ScoringTemplate saved = scoringTemplateRepository.save(template);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteTemplate(String orgId, String templateId) {
        ScoringTemplate template = scoringTemplateRepository.findByIdAndOrganization_OrgId(templateId, orgId)
                .orElseThrow(() -> new IllegalArgumentException("Template not found or access denied"));

        if (template.isSystemTemplate()) {
            throw new IllegalArgumentException("System templates cannot be deleted");
        }

        scoringTemplateRepository.delete(template);
    }

    @Transactional(readOnly = true)
    public List<SimulatedStanding> simulateScoring(String templateId, SimulateScoringRequest request) {
        ScoringTemplate template = scoringTemplateRepository.findById(templateId)
                .orElseThrow(() -> new IllegalArgumentException("Template not found"));

        Map<Integer, BigDecimal> placementPointsMap = template.getPlacementPoints().stream()
                .collect(Collectors.toMap(PlacementPoint::getPlacement, PlacementPoint::getPoints));

        List<SimulatedStanding> standings = new ArrayList<>();

        for (SimulateScoringRequest.MockTeamResult mock : request.getTeamResults()) {
            BigDecimal pPoints = placementPointsMap.getOrDefault(mock.getPlacement(), BigDecimal.ZERO);
            
            int kills = mock.getKills();
            if (template.getKillCap() != null && kills > template.getKillCap()) {
                kills = template.getKillCap();
            }
            BigDecimal kPoints = template.getKillPtsEach().multiply(BigDecimal.valueOf(kills));
            
            BigDecimal bPoints = BigDecimal.ZERO;
            if (mock.isGotFirstBlood() && template.getFirstBloodPts() != null) {
                bPoints = bPoints.add(template.getFirstBloodPts());
            }
            if (mock.getTeamWipes() > 0 && template.getTeamWipePts() != null) {
                bPoints = bPoints.add(template.getTeamWipePts().multiply(BigDecimal.valueOf(mock.getTeamWipes())));
            }
            if (mock.isGotMvp() && template.getMvpPts() != null) {
                bPoints = bPoints.add(template.getMvpPts());
            }
            if (mock.isGotWinnerBonus() && template.getWinnerBonusPts() != null) {
                bPoints = bPoints.add(template.getWinnerBonusPts());
            }

            BigDecimal tPoints = pPoints.add(kPoints).add(bPoints);

            standings.add(SimulatedStanding.builder()
                    .teamName(mock.getTeamName())
                    .mockPlacement(mock.getPlacement())
                    .mockKills(mock.getKills())
                    .placementPoints(pPoints)
                    .killPoints(kPoints)
                    .bonusPoints(bPoints)
                    .totalPoints(tPoints)
                    .build());
        }

        // Apply tiebreakers (Default: 1. Total Points, 2. Kills, 3. Placement)
        // If tiebreakerSeq is configured, we can parse it. For now, simple sort by total points DESC, then Kills DESC, then Placement ASC.
        standings.sort(Comparator.comparing(SimulatedStanding::getTotalPoints).reversed()
                .thenComparing(Comparator.comparing(SimulatedStanding::getMockKills).reversed())
                .thenComparing(SimulatedStanding::getMockPlacement));

        int rank = 1;
        for (SimulatedStanding standing : standings) {
            standing.setFinalRank(rank++);
        }

        return standings;
    }

    private void updatePlacementPoints(ScoringTemplate template, Map<Integer, java.math.BigDecimal> pointsMap) {
        template.getPlacementPoints().clear();
        if (pointsMap != null) {
            pointsMap.forEach((placement, points) -> {
                PlacementPoint pp = new PlacementPoint();
                pp.setScoringTemplate(template);
                pp.setPlacement(placement);
                pp.setPoints(points);
                template.getPlacementPoints().add(pp);
            });
        }
    }

    private ScoringTemplateDto mapToDto(ScoringTemplate template) {
        ScoringTemplateDto dto = new ScoringTemplateDto();
        dto.setId(template.getId());
        dto.setGameId(template.getGame().getGameId());
        dto.setOrgId(template.getOrganization() != null ? template.getOrganization().getOrgId() : null);
        dto.setTemplateName(template.getTemplateName());
        dto.setTemplateCode(template.getTemplateCode());
        dto.setKillCap(template.getKillCap());
        dto.setKillPtsEach(template.getKillPtsEach());
        dto.setFirstBloodPts(template.getFirstBloodPts());
        dto.setTeamWipePts(template.getTeamWipePts());
        dto.setMvpPts(template.getMvpPts());
        dto.setWinnerBonusPts(template.getWinnerBonusPts());
        dto.setTiebreakerSeq(template.getTiebreakerSeq());
        dto.setSystemTemplate(template.isSystemTemplate());
        
        Map<Integer, java.math.BigDecimal> pointsMap = template.getPlacementPoints().stream()
                .collect(Collectors.toMap(PlacementPoint::getPlacement, PlacementPoint::getPoints));
        dto.setPlacementPoints(pointsMap);
        
        dto.setCreatedAt(template.getCreatedAt());
        dto.setUpdatedAt(template.getUpdatedAt());
        return dto;
    }
}
