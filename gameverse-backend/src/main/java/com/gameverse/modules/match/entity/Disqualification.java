package com.gameverse.modules.match.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "disqualifications")
@Getter
@Setter
public class Disqualification {

    @Id
    @UuidGenerator
    @Column(name = "dq_id", length = 36, updatable = false, nullable = false)
    private String dqId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id")
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommended_by")
    private User recommendedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "confirmed_by")
    private User confirmedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "dq_scope", nullable = false)
    private DqScope dqScope;

    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "evidence_url", length = 500)
    private String evidenceUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DqStatus status;

    @Column(name = "recommended_at")
    private LocalDateTime recommendedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum DqScope {
        match, tournament
    }

    public enum DqStatus {
        recommended, confirmed, overturned
    }
}
