package com.gameverse.modules.organization.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.Map;

@Entity
@Table(name = "org_plans")
@Getter
@Setter
public class OrgPlan {

    @Id
    @UuidGenerator
    @Column(name = "plan_id", length = 36, updatable = false, nullable = false)
    private String planId;

    @Column(name = "plan_name", length = 100, nullable = false)
    private String planName;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_code", nullable = false)
    private PlanCode planCode;

    @Column(name = "max_tournaments")
    private Integer maxTournaments;

    @Column(name = "max_teams_per_tournament", nullable = false)
    private Integer maxTeamsPerTournament;

    @Column(name = "max_active_members")
    private Integer maxActiveMembers;

    @Column(name = "price_monthly", nullable = false)
    private BigDecimal priceMonthly;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "features")
    private Map<String, Object> features;

    public enum PlanCode {
        free, starter, pro, elite, enterprise
    }
}
