package com.gameverse.modules.sponsor.repository;

import com.gameverse.modules.sponsor.entity.TournamentSponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentSponsorRepository extends JpaRepository<TournamentSponsor, String> {
    List<TournamentSponsor> findByTournamentId(String tournamentId);
}
