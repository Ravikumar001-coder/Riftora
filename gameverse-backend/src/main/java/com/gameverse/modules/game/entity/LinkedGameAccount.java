package com.gameverse.modules.game.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "linked_game_accounts")
@Getter
@Setter
public class LinkedGameAccount {

    @Id
    @UuidGenerator
    @Column(name = "linked_id", length = 36, updatable = false, nullable = false)
    private String linkedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "in_game_uid", length = 100, nullable = false)
    private String inGameUid;

    @Column(name = "in_game_name", length = 100)
    private String inGameName;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private LinkStatus status = LinkStatus.pending;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_method")
    private VerificationMethod verificationMethod;

    @Column(name = "verification_code", length = 20)
    private String verificationCode;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum LinkStatus {
        pending, verified, failed
    }

    public enum VerificationMethod {
        manual, challenge
    }
}
