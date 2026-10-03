package com.gameverse.modules.dispute.repository;

import com.gameverse.modules.dispute.entity.Dispute;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, String> {
    Page<Dispute> findByTournament_TournamentId(String tournamentId, Pageable pageable);
    Page<Dispute> findByTeam_TeamId(String teamId, Pageable pageable);
    
    // FR-20-013 limit: 3 per team per tournament
    int countByTeam_TeamIdAndTournament_TournamentId(String teamId, String tournamentId);
    
    // FR-20-022: Super Admin Dispute Queue
    Page<Dispute> findByIsEscalatedTrue(Pageable pageable);
}
