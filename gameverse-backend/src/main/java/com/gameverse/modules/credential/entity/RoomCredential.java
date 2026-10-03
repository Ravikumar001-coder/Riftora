package com.gameverse.modules.credential.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.entity.Match;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_credentials")
@Getter
@Setter
public class RoomCredential {

    @Id
    @UuidGenerator
    @Column(name = "credential_id", length = 36, updatable = false, nullable = false)
    private String credentialId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entered_by", nullable = false)
    private User enteredBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "released_by")
    private User releasedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rotated_from")
    private RoomCredential rotatedFrom;

    @Lob
    @Column(name = "room_id_encrypted", nullable = false)
    private byte[] roomIdEncrypted;

    @Lob
    @Column(name = "password_encrypted", nullable = false)
    private byte[] passwordEncrypted;

    @Column(name = "encryption_key_ref", length = 100, nullable = false)
    private String encryptionKeyRef;

    @Enumerated(EnumType.STRING)
    @Column(name = "release_mode", nullable = false)
    private ReleaseMode releaseMode;

    @Column(name = "scheduled_release_at")
    private LocalDateTime scheduledReleaseAt;

    @Column(name = "match_start_minus_x_minutes")
    private Integer matchStartMinusXMinutes;

    @Column(name = "max_views")
    private Integer maxViews;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_locked")
    private Boolean isLocked = false;

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Column(name = "is_revoked")
    private Boolean isRevoked = false;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @Column(name = "revoke_reason", length = 200)
    private String revokeReason;

    @Column(name = "entry_hash", length = 255, nullable = false)
    private String entryHash;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ReleaseMode {
        manual, scheduled, match_start_minus_x
    }
}
