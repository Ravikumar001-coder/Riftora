package com.gameverse.modules.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_moderation_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatModerationLog {

    @Id
    @UuidGenerator
    @Column(name = "log_id", length = 36, updatable = false, nullable = false)
    private String logId;

    @Column(name = "tournament_id", length = 36, nullable = false)
    private String tournamentId;

    @Column(name = "moderator_id", length = 36, nullable = false)
    private String moderatorId;

    @Column(name = "target_user_id", length = 36)
    private String targetUserId;

    @Column(name = "target_guest_name", length = 100)
    private String targetGuestName;

    @Column(name = "action_type", length = 50, nullable = false)
    private String actionType; // DELETE, WARN, MUTE, BAN

    @Column(name = "message_content", columnDefinition = "TEXT")
    private String messageContent;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
