package com.gameverse.modules.chat.repository;

import com.gameverse.modules.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByTournamentIdAndChannelTypeAndCreatedAtAfterOrderByCreatedAtAsc(String tournamentId, String channelType, LocalDateTime createdAt);

    Optional<ChatMessage> findFirstByTournamentIdAndSenderIdOrderByCreatedAtDesc(String tournamentId, String senderId);
    
    Optional<ChatMessage> findFirstByTournamentIdAndSenderNameOrderByCreatedAtDesc(String tournamentId, String senderName);
}
