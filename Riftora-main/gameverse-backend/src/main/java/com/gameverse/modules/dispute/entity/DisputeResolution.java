package com.gameverse.modules.dispute.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "dispute_resolutions")
@Getter
@Setter
public class DisputeResolution {

    @Id
    @UuidGenerator
    @Column(name = "resolution_id", length = 36, updatable = false, nullable = false)
    private String resolutionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispute_id", nullable = false, unique = true)
    private Dispute dispute;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by", nullable = false)
    private User resolvedBy;

    @Column(name = "resolution_notes", columnDefinition = "TEXT", nullable = false)
    private String resolutionNotes;

    @Column(name = "action_taken", length = 100, nullable = false)
    private String actionTaken;

    @Column(name = "resolved_at", updatable = false)
    private LocalDateTime resolvedAt;

    @Column(name = "super_admin_override")
    private Boolean superAdminOverride = false;

    @Column(name = "super_admin_notes", columnDefinition = "TEXT")
    private String superAdminNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "super_admin_resolved_by")
    private User superAdminResolvedBy;

    @Column(name = "super_admin_resolved_at")
    private LocalDateTime superAdminResolvedAt;

    @PrePersist
    protected void onCreate() {
        resolvedAt = LocalDateTime.now();
    }


}
