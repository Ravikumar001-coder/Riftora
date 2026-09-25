package com.gameverse.modules.broadcast.entity;

import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stream_metrics")
@Getter
@Setter
public class StreamMetric {

    @Id
    @UuidGenerator
    @Column(name = "metric_id", length = 36, updatable = false, nullable = false)
    private String metricId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "viewer_count")
    private Integer viewerCount = 0;

    @Column(name = "bitrate_kbps")
    private Integer bitrateKbps;

    @Column(name = "fps")
    private Integer fps;

    @Column(name = "dropped_frames_pct")
    private BigDecimal droppedFramesPct;

    @Column(name = "cpu_usage_pct")
    private BigDecimal cpuUsagePct;
}
