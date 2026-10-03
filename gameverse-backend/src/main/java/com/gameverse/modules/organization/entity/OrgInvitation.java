package com.gameverse.modules.organization.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "org_invitations")
@Getter
@Setter
public class OrgInvitation {

    @Id
    @UuidGenerator
    @Column(name = "invite_id", length = 36, updatable = false, nullable = false)
    private String inviteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @Column(name = "email", length = 255, nullable = true)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_user_id")
    private User targetUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private OrgMember.OrgRole role;

    @Column(name = "token", length = 255, unique = true, nullable = false)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InviteStatus status = InviteStatus.pending;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by", nullable = false)
    private User invitedBy;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum InviteStatus {
        pending, accepted, expired
    }
}
