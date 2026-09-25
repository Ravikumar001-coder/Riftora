package com.gameverse.modules.tournament.repository;

import com.gameverse.modules.tournament.entity.TournamentBookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TournamentBookmarkRepository extends JpaRepository<TournamentBookmark, String> {
    Optional<TournamentBookmark> findByUserUserIdAndTournamentTournamentId(String userId, String tournamentId);
    Page<TournamentBookmark> findByUserUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    void deleteByUserUserIdAndTournamentTournamentId(String userId, String tournamentId);
    boolean existsByUserUserIdAndTournamentTournamentId(String userId, String tournamentId);
}
