package com.gameverse.modules.registration.repository;

import com.gameverse.modules.registration.entity.RegistrationRoster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRosterRepository extends JpaRepository<RegistrationRoster, String> {
    List<RegistrationRoster> findByRegistration_RegistrationId(String registrationId);
    Optional<RegistrationRoster> findByRegistration_RegistrationIdAndUser_UserId(String registrationId, String userId);
    List<RegistrationRoster> findByRegistration_Tournament_TournamentIdAndInGameUidIn(String tournamentId, List<String> inGameUids);
}
