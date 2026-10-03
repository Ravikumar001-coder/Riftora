package com.gameverse.modules.organization.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "org_join_links")
@Getter
@Setter
public class OrgJoinLink {

    @Id
    @UuidGenerator
    @Column(name = "link_id", length = 36, updatable = false, nullable = false)
    private String linkId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @Column(name = "token", length = 255, unique = true, nullable = false)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private OrgMember.OrgRole role;

    @Column(name = "max_uses")
    private Integer maxUses;

    @Column(name = "current_uses", nullable = false)
    private Integer currentUses = 0;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public boolean isValid() {
        if (!isActive) return false;
        if (expiresAt != null && expiresAt.isBefore(LocalDateTime.now())) return false;
        if (maxUses != null && currentUses >= maxUses) return false;
        return true;
    }
}
