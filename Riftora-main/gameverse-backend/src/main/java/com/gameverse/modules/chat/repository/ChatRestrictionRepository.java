package com.gameverse.modules.chat.repository;

import com.gameverse.modules.chat.entity.ChatRestriction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRestrictionRepository extends JpaRepository<ChatRestriction, String> {
    Optional<ChatRestriction> findByTournamentIdAndUserIdAndRestrictionType(String tournamentId, String userId, String restrictionType);
    Optional<ChatRestriction> findByTournamentIdAndGuestNameAndRestrictionType(String tournamentId, String guestName, String restrictionType);
    List<ChatRestriction> findByTournamentId(String tournamentId);
}
