package com.gameverse.modules.broadcast.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.entity.Match;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_vod_links")
@Getter
@Setter
public class MatchVodLink {

    @Id
    @UuidGenerator
    @Column(name = "vod_id", length = 36, updatable = false, nullable = false)
    private String vodId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_by", nullable = false)
    private User linkedBy;

    @Column(name = "vod_url", length = 500, nullable = false)
    private String vodUrl;

    @Column(name = "start_offset", length = 50)
    private String startOffset;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform", nullable = false)
    private StreamConfig.StreamPlatform platform;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
