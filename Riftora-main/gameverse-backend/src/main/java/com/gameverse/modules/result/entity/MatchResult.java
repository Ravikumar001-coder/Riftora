package com.gameverse.modules.result.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.entity.Match;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.type.SqlTypes;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "match_results")
@Getter
@Setter
public class MatchResult {

    @Id
    @UuidGenerator
    @Column(name = "result_id", length = 36, updatable = false, nullable = false)
    private String resultId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false, unique = true)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    @Column(name = "screenshot_url", length = 500)
    private String screenshotUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ResultStatus status = ResultStatus.pending;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "is_draft")
    private Boolean isDraft = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_mode")
    private PublicationMode publicationMode = PublicationMode.auto_publish;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "matchResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamMatchScore> teamScores = new ArrayList<>();
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "anomalies", columnDefinition = "json")
    private List<String> anomalies = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ResultStatus {
        pending, verified, disputed, rejected, voided
    }

    public enum PublicationMode {
        auto_publish, director_verify
    }
}
