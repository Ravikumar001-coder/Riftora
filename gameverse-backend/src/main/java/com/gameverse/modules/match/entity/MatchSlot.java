package com.gameverse.modules.match.entity;

import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.team.entity.Team;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_slots")
@Getter
@Setter
public class MatchSlot {

    @Id
    @UuidGenerator
    @Column(name = "slot_id", length = 36, updatable = false, nullable = false)
    private String slotId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id")
    private Registration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "slot_number", nullable = false)
    private Integer slotNumber;

    @Column(name = "is_bye")
    private Boolean isBye = false;

    @Column(name = "no_show")
    private Boolean noShow = false;

    @Column(name = "no_show_at")
    private LocalDateTime noShowAt;

    @Column(name = "slot_label", length = 100)
    private String slotLabel;
}
