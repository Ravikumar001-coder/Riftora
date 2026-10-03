package com.gameverse.modules.match.repository;

import com.gameverse.modules.match.entity.Disqualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisqualificationRepository extends JpaRepository<Disqualification, String> {
    List<Disqualification> findByTournament_TournamentId(String tournamentId);
    List<Disqualification> findByRegistration_RegistrationId(String registrationId);
}
