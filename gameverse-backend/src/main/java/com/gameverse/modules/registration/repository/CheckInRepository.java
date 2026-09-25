package com.gameverse.modules.registration.repository;

import com.gameverse.modules.registration.entity.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, String> {
    Optional<CheckIn> findByRegistration_RegistrationId(String registrationId);
    List<CheckIn> findByTournament_TournamentId(String tournamentId);
}
