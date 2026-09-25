package com.gameverse.modules.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_restrictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRestriction {

    @Id
    @UuidGenerator
    @Column(name = "id", length = 36, updatable = false, nullable = false)
    private String id;

    @Column(name = "tournament_id", length = 36, nullable = false)
    private String tournamentId;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "guest_name", length = 100)
    private String guestName;

    @Column(name = "restriction_type", length = 20, nullable = false)
    private String restrictionType; // MUTE, BAN

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
