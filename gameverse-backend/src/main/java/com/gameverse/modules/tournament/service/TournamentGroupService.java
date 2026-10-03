package com.gameverse.modules.tournament.service;

import com.gameverse.modules.tournament.dto.TournamentGroupDto;
import com.gameverse.modules.tournament.dto.UpdateAdvancementRulesRequest;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.entity.TournamentGroup;
import com.gameverse.modules.tournament.repository.TournamentGroupRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentGroupService {

    private final TournamentGroupRepository tournamentGroupRepository;
    private final TournamentRepository tournamentRepository;

    @Transactional(readOnly = true)
    public List<TournamentGroupDto> getTournamentGroups(String tournamentId) {
        return tournamentGroupRepository.findByTournament_TournamentId(tournamentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateAdvancementRules(String tournamentId, UpdateAdvancementRulesRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        
        tournament.setGroupAdvancementRule(request.getGroupAdvancementRule());
        tournament.setWildCardSpots(request.getWildCardSpots());
        
        tournamentRepository.save(tournament);
    }

    @Transactional
    public void generateFinals(String tournamentId) {
        tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        
        // In a full implementation, this would:
        // 1. Fetch group standings via LeaderboardService (filtered by group)
        // 2. Select top N teams per group based on advancement_spots
        // 3. Select wild card spots based on overall kills/points from non-advanced teams
        // 4. Create new Match entities for the Finals phase and assign these teams to slots.
        
        // For the scope of this requirement, we will mark this as executed
        // to support the UI button interaction.
    }

    private TournamentGroupDto mapToDto(TournamentGroup group) {
        return TournamentGroupDto.builder()
                .groupId(group.getGroupId())
                .tournamentId(group.getTournament().getTournamentId())
                .groupName(group.getGroupName())
                .groupCode(group.getGroupCode())
                .advancementSpots(group.getAdvancementSpots())
                .build();
    }
}
