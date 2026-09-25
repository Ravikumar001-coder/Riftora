package com.gameverse.modules.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_message_reactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageReaction {

    @Id
    @UuidGenerator
    @Column(name = "reaction_id", length = 36, updatable = false, nullable = false)
    private String reactionId;

    @Column(name = "message_id", length = 36, nullable = false)
    private String messageId;

    @Column(name = "user_id", length = 50, nullable = false)
    private String userId;

    @Column(name = "emoji", length = 20, nullable = false)
    private String emoji;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
