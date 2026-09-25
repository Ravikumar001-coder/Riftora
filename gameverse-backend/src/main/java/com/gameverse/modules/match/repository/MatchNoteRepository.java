package com.gameverse.modules.match.repository;

import com.gameverse.modules.match.entity.MatchNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchNoteRepository extends JpaRepository<MatchNote, String> {
    List<MatchNote> findByMatch_MatchIdOrderByCreatedAtDesc(String matchId);
}
