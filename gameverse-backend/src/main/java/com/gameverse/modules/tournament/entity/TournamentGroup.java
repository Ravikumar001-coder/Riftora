package com.gameverse.modules.tournament.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "tournament_groups")
@Getter
@Setter
public class TournamentGroup {

    @Id
    @UuidGenerator
    @Column(name = "group_id", length = 36, updatable = false, nullable = false)
    private String groupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @Column(name = "group_name", length = 20, nullable = false)
    private String groupName;

    @Column(name = "group_code", length = 5, nullable = false)
    private String groupCode;

    @Column(name = "advancement_spots", nullable = false)
    private Integer advancementSpots = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
