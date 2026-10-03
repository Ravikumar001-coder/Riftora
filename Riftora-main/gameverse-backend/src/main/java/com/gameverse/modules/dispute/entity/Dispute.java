package com.gameverse.modules.dispute.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.team.entity.Team;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "disputes")
@Getter
@Setter
public class Dispute {

    @Id
    @UuidGenerator
    @Column(name = "dispute_id", length = 36, updatable = false, nullable = false)
    private String disputeId;

    @Column(name = "reference_number", length = 50, unique = true)
    private String referenceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id")
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    @Column(name = "category", length = 100, nullable = false)
    private String category;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "requested_resolution", columnDefinition = "TEXT")
    private String requestedResolution;

    @Column(name = "evidence_urls", columnDefinition = "JSON")
    private String evidenceUrls;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DisputeStatus status = DisputeStatus.OPEN;

    @Column(name = "is_escalated")
    private Boolean isEscalated = false;

    @Column(name = "escalated_at")
    private LocalDateTime escalatedAt;

    @Column(name = "is_appealed")
    private Boolean isAppealed = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToOne(mappedBy = "dispute", cascade = CascadeType.ALL)
    private DisputeResolution resolution;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum DisputeStatus {
        OPEN, UNDER_REVIEW, PENDING_EVIDENCE, RESOLVED_CORRECTION, RESOLVED_NO_CHANGE, DISMISSED
    }
}
