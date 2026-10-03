package com.gameverse.modules.audit.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;

@Entity
@Table(name = "immutable_audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImmutableAuditLog {
    @Id
    @UuidGenerator
    @Column(name = "event_id", length = 36, updatable = false, nullable = false)
    private String eventId;

    @Column(name = "event_type", length = 100, nullable = false, updatable = false)
    private String eventType;

    @Column(name = "actor_id", length = 36, updatable = false)
    private String actorId;

    @Column(name = "actor_role", length = 100, updatable = false)
    private String actorRole;

    @Column(name = "target_type", length = 100, updatable = false)
    private String targetType;

    @Column(name = "target_id", length = 36, updatable = false)
    private String targetId;

    @Column(name = "event_data", columnDefinition = "JSON", updatable = false)
    private String eventData;

    @Column(name = "ip_address", length = 45, updatable = false)
    private String ipAddress;

    @Column(name = "user_agent", length = 500, updatable = false)
    private String userAgent;

    @Column(name = "previous_hash", length = 64, updatable = false)
    private String previousHash;

    @Column(name = "hash", length = 64, nullable = false, updatable = false)
    private String hash;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
