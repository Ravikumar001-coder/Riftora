package com.gameverse.modules.audit.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
public class AuditLog {

    @Id
    @UuidGenerator
    @Column(name = "log_id", length = 36, updatable = false, nullable = false)
    private String logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_user_id", nullable = false)
    private User actor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id")
    private Match match;

    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "action_code", length = 100, nullable = false)
    private String actionCode;

    @Column(name = "action_details", columnDefinition = "JSON")
    private String actionDetails;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
