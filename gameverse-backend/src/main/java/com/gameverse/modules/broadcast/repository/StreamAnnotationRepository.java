package com.gameverse.modules.broadcast.repository;

import com.gameverse.modules.broadcast.entity.StreamAnnotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StreamAnnotationRepository extends JpaRepository<StreamAnnotation, String> {
    List<StreamAnnotation> findByTournament_TournamentIdOrderByCreatedAtDesc(String tournamentId);
}
