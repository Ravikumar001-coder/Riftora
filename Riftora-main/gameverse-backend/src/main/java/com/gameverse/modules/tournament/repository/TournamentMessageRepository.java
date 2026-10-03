package com.gameverse.modules.tournament.repository;

import com.gameverse.modules.tournament.entity.TournamentMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentMessageRepository extends JpaRepository<TournamentMessage, String> {
    List<TournamentMessage> findByTournament_TournamentIdOrderByCreatedAtDesc(String tournamentId);
}
