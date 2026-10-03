package com.gameverse.modules.tournament.repository;

import com.gameverse.modules.tournament.entity.TournamentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentGroupRepository extends JpaRepository<TournamentGroup, String> {
    
    List<TournamentGroup> findByTournament_TournamentId(String tournamentId);

    Optional<TournamentGroup> findByTournament_TournamentIdAndGroupCode(String tournamentId, String groupCode);
}
