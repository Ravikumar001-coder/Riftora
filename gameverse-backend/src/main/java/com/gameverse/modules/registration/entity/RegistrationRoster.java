package com.gameverse.modules.registration.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.team.entity.TeamMember;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "registration_rosters")
@Getter
@Setter
public class RegistrationRoster {

    @Id
    @UuidGenerator
    @Column(name = "roster_id", length = 36, updatable = false, nullable = false)
    private String rosterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_member_id")
    private TeamMember teamMember;

    @Enumerated(EnumType.STRING)
    @Column(name = "player_role", nullable = false)
    private PlayerRole playerRole;

    @Column(name = "in_game_uid", length = 100, nullable = false)
    private String inGameUid;

    @Column(name = "in_game_name", length = 100)
    private String inGameName;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "activated_at")
    private LocalDateTime activatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activated_by")
    private User activatedBy;

    public enum PlayerRole {
        player, substitute
    }
}
