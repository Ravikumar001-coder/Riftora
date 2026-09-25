package com.gameverse.modules.analytics.repository;

import com.gameverse.modules.analytics.entity.TournamentAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentAnalyticsRepository extends JpaRepository<TournamentAnalytics, String> {

    Optional<TournamentAnalytics> findByTournamentTournamentId(String tournamentId);

    List<TournamentAnalytics> findByOrganizationOrgId(String orgId);
    
    @Query("SELECT ta FROM TournamentAnalytics ta JOIN FETCH ta.tournament t JOIN FETCH t.game WHERE ta.organization.orgId = :orgId")
    List<TournamentAnalytics> findWithTournamentAndGameByOrgId(@Param("orgId") String orgId);
}
