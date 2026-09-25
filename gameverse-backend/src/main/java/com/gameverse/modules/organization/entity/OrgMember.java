package com.gameverse.modules.organization.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "org_members")
@Getter
@Setter
public class OrgMember {

    @Id
    @UuidGenerator
    @Column(name = "member_id", length = 36, updatable = false, nullable = false)
    private String memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private OrgRole role;

    @Column(name = "custom_role_name", length = 50)
    private String customRoleName;

    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }

    public enum OrgRole {
        org_owner, org_admin, tournament_director, referee, broadcast_producer, sponsor_rep
    }
}
