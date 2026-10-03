package com.gameverse.modules.registration.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "check_ins")
@Getter
@Setter
public class CheckIn {

    @Id
    @UuidGenerator
    @Column(name = "checkin_id", length = 36, updatable = false, nullable = false)
    private String checkinId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checked_in_by", nullable = false)
    private User checkedInBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "checkin_type", nullable = false)
    private CheckinType checkinType;

    @Column(name = "checkin_at", updatable = false)
    private LocalDateTime checkinAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        checkinAt = LocalDateTime.now();
    }

    public enum CheckinType {
        self, manual
    }
}
