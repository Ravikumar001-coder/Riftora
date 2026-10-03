package com.gameverse.modules.team.service;

import com.gameverse.modules.team.dto.TeamRankingDto;
import com.gameverse.modules.team.repository.TeamStatisticRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeamRankingService {

    private final TeamStatisticRepository teamStatisticRepository;

    @Transactional(readOnly = true)
    public Page<TeamRankingDto> getTopTeamsByGame(String gameId, Pageable pageable) {
        AtomicInteger rankCounter = new AtomicInteger((int) pageable.getOffset() + 1);
        return teamStatisticRepository.findByGame_GameIdOrderByEloRatingDesc(gameId, pageable)
                .map(stat -> TeamRankingDto.builder()
                        .teamId(stat.getTeam().getTeamId())
                        .teamName(stat.getTeam().getTeamName())
                        .teamTag(stat.getTeam().getTeamTag())
                        .logoUrl(stat.getTeam().getLogoUrl())
                        .eloRating(stat.getEloRating())
                        .rank(rankCounter.getAndIncrement())
                        .build());
    }

    // TODO (Phase 5): Create @EventListener for TournamentFinalizedEvent 
    // to recalculate Elo within 15 minutes of tournament finalization.
    public void recalculateEloRatingsForTournament(String tournamentId) {
        log.info("Recalculating Elo ratings for tournament {}", tournamentId);
        // Implementation will depend on Match Result data
    }
}
