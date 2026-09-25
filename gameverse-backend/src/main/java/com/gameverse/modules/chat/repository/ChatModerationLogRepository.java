package com.gameverse.modules.chat.repository;

import com.gameverse.modules.chat.entity.ChatModerationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatModerationLogRepository extends JpaRepository<ChatModerationLog, String> {
    List<ChatModerationLog> findByTournamentIdOrderByCreatedAtDesc(String tournamentId);
}
