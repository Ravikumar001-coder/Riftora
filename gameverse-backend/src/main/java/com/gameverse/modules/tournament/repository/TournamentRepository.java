package com.gameverse.modules.tournament.repository;

import com.gameverse.modules.tournament.entity.Tournament;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, String>, JpaSpecificationExecutor<Tournament> {
    Optional<Tournament> findBySlug(String slug);
    Page<Tournament> findByOrganization_OrgId(String orgId, Pageable pageable);
    Page<Tournament> findByStatus(Tournament.TournamentStatus status, Pageable pageable);
    java.util.List<Tournament> findByStatus(Tournament.TournamentStatus status);
    Page<Tournament> findByGame_GameIdAndStatusIn(String gameId, java.util.List<Tournament.TournamentStatus> statuses, Pageable pageable);
    long countByOrganization_OrgIdAndStatusIn(String orgId, java.util.List<Tournament.TournamentStatus> statuses);
    Page<Tournament> findAllByOrganization_OrgIdAndStatusIn(String orgId, java.util.List<Tournament.TournamentStatus> statuses, Pageable pageable);

    Optional<Tournament> findByMasterAccessCode(String code);
}
