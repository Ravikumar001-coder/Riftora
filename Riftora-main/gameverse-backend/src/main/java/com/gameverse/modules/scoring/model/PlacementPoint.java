package com.gameverse.modules.scoring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;

@Entity
@Table(name = "placement_points", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"template_id", "placement"})
})
@Getter
@Setter
public class PlacementPoint {

    @Id
    @UuidGenerator
    @Column(name = "pp_id", length = 36, updatable = false, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private ScoringTemplate scoringTemplate;

    @Column(name = "placement", nullable = false)
    private Integer placement;

    @Column(name = "points", nullable = false, precision = 6, scale = 2)
    private BigDecimal points;
}
