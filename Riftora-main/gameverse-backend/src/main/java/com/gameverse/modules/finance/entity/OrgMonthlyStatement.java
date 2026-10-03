package com.gameverse.modules.finance.entity;

import com.gameverse.modules.organization.entity.Organization;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * FR-16-023: Monthly financial statements for each organization.
 */
@Entity
@Table(name = "org_monthly_statements")
@Getter
@Setter
public class OrgMonthlyStatement {

    @Id
    @UuidGenerator
    @Column(name = "statement_id", length = 36, updatable = false, nullable = false)
    private String statementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "month", nullable = false)
    private Integer month; // 1-12

    @Column(name = "total_revenue", precision = 12, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "total_fees_paid", precision = 12, scale = 2)
    private BigDecimal totalFeesPaid = BigDecimal.ZERO;

    @Column(name = "total_prizes", precision = 12, scale = 2)
    private BigDecimal totalPrizes = BigDecimal.ZERO;

    @Column(name = "total_earnings", precision = 12, scale = 2)
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(name = "tournament_count")
    private Integer tournamentCount = 0;

    @Column(name = "registration_count")
    private Integer registrationCount = 0;

    @Column(name = "generated_at", updatable = false)
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}
