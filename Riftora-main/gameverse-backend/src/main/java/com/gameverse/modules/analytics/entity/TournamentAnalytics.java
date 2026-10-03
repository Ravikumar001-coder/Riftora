package com.gameverse.modules.analytics.entity;

import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tournament_analytics")
@Getter
@Setter
public class TournamentAnalytics {

    @Id
    @UuidGenerator
    @Column(name = "analytics_id", length = 36, updatable = false, nullable = false)
    private String analyticsId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false, unique = true)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @Column(name = "total_participants")
    private Integer totalParticipants = 0;

    @Column(name = "total_registrations")
    private Integer totalRegistrations = 0;

    @Column(name = "prize_pool_distributed")
    private BigDecimal prizePoolDistributed = BigDecimal.ZERO;

    @Column(name = "total_revenue")
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "no_show_rate")
    private BigDecimal noShowRate = BigDecimal.ZERO;

    @Column(name = "disputes_raised")
    private Integer disputesRaised = 0;

    @Column(name = "avg_match_duration_minutes")
    private Integer avgMatchDurationMinutes = 0;

    @Column(name = "stream_peak_viewers")
    private Integer streamPeakViewers = 0;

    @Column(name = "on_time_match_delivery_rate")
    private BigDecimal onTimeMatchDeliveryRate = BigDecimal.ZERO;

    @Column(name = "scoring_error_rate")
    private BigDecimal scoringErrorRate = BigDecimal.ZERO;

    @Column(name = "check_in_rate")
    private BigDecimal checkInRate = BigDecimal.ZERO;

    @Column(name = "organizer_health_score")
    private BigDecimal organizerHealthScore = BigDecimal.ZERO;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        calculatedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
