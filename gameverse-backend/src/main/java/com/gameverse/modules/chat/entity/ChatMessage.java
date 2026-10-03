package com.gameverse.modules.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @UuidGenerator
    @Column(name = "message_id", length = 36, updatable = false, nullable = false)
    private String messageId;

    @Column(name = "tournament_id", length = 36, nullable = false)
    private String tournamentId;

    @Column(name = "channel_type", nullable = false)
    private String channelType;

    @Column(name = "sender_id", length = 36, nullable = false)
    private String senderId;

    @Column(name = "sender_name", length = 100, nullable = false)
    private String senderName;

    @Column(name = "sender_role", length = 50, nullable = false)
    private String senderRole;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    @Column(name = "is_pinned")
    private Boolean isPinned = false;

    @Builder.Default
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @Builder.Default
    @Column(name = "is_system")
    private Boolean isSystem = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isPinned == null) this.isPinned = false;
        if (this.isDeleted == null) this.isDeleted = false;
        if (this.isSystem == null) this.isSystem = false;
    }
}
