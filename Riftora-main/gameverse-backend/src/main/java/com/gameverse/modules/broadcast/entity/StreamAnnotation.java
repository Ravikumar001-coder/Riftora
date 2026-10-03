package com.gameverse.modules.broadcast.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "stream_annotations")
@Getter
@Setter
public class StreamAnnotation {

    @Id
    @UuidGenerator
    @Column(name = "annotation_id", length = 36, updatable = false, nullable = false)
    private String annotationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "label", nullable = false)
    private AnnotationLabel label;

    @Column(name = "custom_label", length = 100)
    private String customLabel;

    @Column(name = "stream_timestamp", length = 50)
    private String streamTimestamp;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum AnnotationLabel {
        match_start, match_end, chicken_dinner, notable_kill, technical_pause, custom
    }
}
