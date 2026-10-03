package com.gameverse.modules.game.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "blacklist_uids", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"game_id", "uid"})
})
@Getter
@Setter
public class BlacklistUid {

    @Id
    @UuidGenerator
    @Column(name = "blacklist_id", length = 36, updatable = false, nullable = false)
    private String blacklistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "uid", length = 100, nullable = false)
    private String uid;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
