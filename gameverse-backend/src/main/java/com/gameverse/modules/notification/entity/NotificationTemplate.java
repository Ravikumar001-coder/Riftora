package com.gameverse.modules.notification.entity;

import com.gameverse.modules.organization.entity.Organization;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_templates")
@Getter
@Setter
public class NotificationTemplate {

    @Id
    @UuidGenerator
    @Column(name = "template_id", length = 36, updatable = false, nullable = false)
    private String templateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id")
    private Organization organization;

    @Column(name = "template_code", length = 50, nullable = false)
    private String templateCode;

    @Column(name = "title_template", length = 200, nullable = false)
    private String titleTemplate;

    @Column(name = "body_template", columnDefinition = "TEXT", nullable = false)
    private String bodyTemplate;

    @Column(name = "channels", columnDefinition = "JSON", nullable = false)
    private String channels;

    @Column(name = "language", length = 20)
    private String language;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority = Priority.medium;

    @Column(name = "is_system_tmpl")
    private Boolean isSystemTmpl = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Priority {
        low, medium, high, critical
    }
}
