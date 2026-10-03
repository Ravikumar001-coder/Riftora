package com.gameverse.modules.team.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "team_invitations")
@Getter
@Setter
public class TeamInvitation {

    @Id
    @UuidGenerator
    @Column(name = "invite_id", length = 36, updatable = false, nullable = false)
    private String inviteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by", nullable = false)
    private User invitedBy;

    @Column(name = "invited_email", length = 255)
    private String invitedEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_user_id")
    private User invitedUser;

    @Column(name = "in_game_uid", length = 100)
    private String inGameUid;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private TeamMember.TeamRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InviteStatus status = InviteStatus.pending;

    @Column(name = "token_hash", length = 255, nullable = false)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum InviteStatus {
        pending, accepted, declined, expired
    }
}
