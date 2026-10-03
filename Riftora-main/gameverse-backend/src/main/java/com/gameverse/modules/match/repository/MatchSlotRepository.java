package com.gameverse.modules.match.repository;

import com.gameverse.modules.match.entity.MatchSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchSlotRepository extends JpaRepository<MatchSlot, String> {
    List<MatchSlot> findByMatch_MatchId(String matchId);
    List<MatchSlot> findByMatch_MatchIdOrderBySlotNumberAsc(String matchId);
    Optional<MatchSlot> findByMatch_MatchIdAndSlotNumber(String matchId, Integer slotNumber);
}
