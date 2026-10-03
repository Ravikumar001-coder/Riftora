package com.gameverse.modules.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSettings {

    @Id
    @Column(name = "tournament_id", length = 36, updatable = false, nullable = false)
    private String tournamentId;

    @Builder.Default
    @Column(name = "slow_mode_seconds")
    private Integer slowModeSeconds = 0;

    @Builder.Default
    @Column(name = "subscribers_only_mode")
    private Boolean subscribersOnlyMode = false;

    @Builder.Default
    @Column(name = "competitor_only_mode")
    private Boolean competitorOnlyMode = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.slowModeSeconds == null) this.slowModeSeconds = 0;
        if (this.subscribersOnlyMode == null) this.subscribersOnlyMode = false;
        if (this.competitorOnlyMode == null) this.competitorOnlyMode = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
