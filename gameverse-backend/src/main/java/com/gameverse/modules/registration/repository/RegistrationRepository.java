package com.gameverse.modules.registration.repository;

import com.gameverse.modules.registration.entity.Registration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, String>, JpaSpecificationExecutor<Registration> {
    Optional<Registration> findByReferenceNumber(String referenceNumber);
    Optional<Registration> findByTournament_TournamentIdAndTeam_TeamId(String tournamentId, String teamId);
    Page<Registration> findByTournament_TournamentId(String tournamentId, Pageable pageable);
    Page<Registration> findByTeam_TeamId(String teamId, Pageable pageable);
    long countByTournament_TournamentIdAndStatus(String tournamentId, Registration.RegistrationStatus status);
    long countByTournament_TournamentIdAndStatusIn(String tournamentId, java.util.List<Registration.RegistrationStatus> statuses);
    java.util.List<Registration> findByTournament_TournamentIdAndStatus(String tournamentId, Registration.RegistrationStatus status);
    
    long countByTournament_Organization_OrgIdAndStatus(String orgId, Registration.RegistrationStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT r.team.teamId, COUNT(DISTINCT r.tournament.tournamentId) " +
           "FROM Registration r " +
           "WHERE r.tournament.organization.orgId = :orgId AND r.status = 'approved' " +
           "GROUP BY r.team.teamId")
    java.util.List<Object[]> countTournamentsPerTeamByOrg(@org.springframework.data.repository.query.Param("orgId") String orgId);
}
