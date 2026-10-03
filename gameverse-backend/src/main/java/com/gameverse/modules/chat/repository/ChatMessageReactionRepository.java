package com.gameverse.modules.chat.repository;

import com.gameverse.modules.chat.entity.ChatMessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageReactionRepository extends JpaRepository<ChatMessageReaction, String> {
    List<ChatMessageReaction> findByMessageIdIn(List<String> messageIds);
    Optional<ChatMessageReaction> findByMessageIdAndUserIdAndEmoji(String messageId, String userId, String emoji);
}
