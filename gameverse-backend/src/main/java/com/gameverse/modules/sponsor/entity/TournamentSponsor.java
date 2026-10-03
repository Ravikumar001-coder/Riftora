package com.gameverse.modules.sponsor.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "tournament_sponsors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournamentSponsor {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "assign_id", length = 36, updatable = false, nullable = false)
    private String id;

    @Column(name = "tournament_id", length = 36, nullable = false)
    private String tournamentId;

    @ManyToOne(fetch = FetchType.EAGER) // Eager fetch useful for UI displays
    @JoinColumn(name = "sponsor_id", nullable = false)
    private Sponsor sponsor;

    @Column(name = "opt_out_graphics")
    private boolean optOutGraphics;

    @Column(name = "opt_out_stream")
    private boolean optOutStream;

    @Column(name = "impressions_page")
    private int impressionsPage;

    @Column(name = "impressions_stream")
    private int impressionsStream;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
