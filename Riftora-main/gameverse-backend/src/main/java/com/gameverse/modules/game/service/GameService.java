package com.gameverse.modules.game.service;

import com.gameverse.modules.game.dto.GameDto;
import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.game.repository.GameRepository;
import com.gameverse.modules.scoring.dto.ScoringTemplateDto;
import com.gameverse.modules.scoring.model.ScoringTemplate;
import com.gameverse.modules.scoring.repository.ScoringTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final ScoringTemplateRepository scoringTemplateRepository;

    @Transactional(readOnly = true)
    public List<GameDto> getAllGames() {
        return gameRepository.findAll().stream()
                .map(this::mapToGameDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScoringTemplateDto> getSystemTemplates(String gameId) {
        return scoringTemplateRepository.findByGame_GameIdAndIsSystemTemplateTrue(gameId).stream()
                .map(this::mapToScoringTemplateDto)
                .collect(Collectors.toList());
    }

    private GameDto mapToGameDto(Game game) {
        return GameDto.builder()
                .gameId(game.getGameId())
                .gameName(game.getGameName())
                .gameCode(game.getGameCode())
                .iconUrl(game.getIconUrl())
                .coverUrl(game.getCoverUrl())
                .uidLabel(game.getUidLabel())
                .uidRegex(game.getUidRegex())
                .uidExample(game.getUidExample())
                .maxTeamSize(game.getMaxTeamSize())
                .minTeamSize(game.getMinTeamSize())
                .maxSubstitutes(game.getMaxSubstitutes())
                .isActive(game.getIsActive())
                .build();
    }

    private ScoringTemplateDto mapToScoringTemplateDto(ScoringTemplate template) {
        return ScoringTemplateDto.builder()
                .id(template.getId())
                .templateName(template.getTemplateName())
                .templateCode(template.getTemplateCode())
                .gameId(template.getGame().getGameId())
                .killCap(template.getKillCap())
                .killPtsEach(template.getKillPtsEach())
                .tiebreakerSeq(template.getTiebreakerSeq())
                .isSystemTemplate(template.isSystemTemplate())
                .build();
    }
}
