package com.gameverse.modules.tournament.repository;

import com.gameverse.modules.tournament.entity.TournamentStaff;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentStaffRepository extends JpaRepository<TournamentStaff, String> {
    @EntityGraph(attributePaths = {"user"})
    List<TournamentStaff> findByTournament_TournamentId(String tournamentId);
    
    Optional<TournamentStaff> findByTournament_TournamentIdAndUser_UserIdAndStaffRole(
            String tournamentId, String userId, TournamentStaff.StaffRole role);
}
