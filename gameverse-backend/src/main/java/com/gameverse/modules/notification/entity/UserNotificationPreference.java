package com.gameverse.modules.notification.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "user_notification_preferences")
@Getter
@Setter
public class UserNotificationPreference {

    @Id
    @UuidGenerator
    @Column(name = "preference_id", length = 36, updatable = false, nullable = false)
    private String preferenceId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "in_app_enabled")
    private Boolean inAppEnabled;

    @Column(name = "push_enabled")
    private Boolean pushEnabled;

    @Column(name = "sms_enabled")
    private Boolean smsEnabled;

    @Column(name = "email_enabled")
    private Boolean emailEnabled;

    @Column(name = "do_not_disturb_enabled")
    private Boolean doNotDisturbEnabled;

    @Column(name = "dnd_start_time")
    private LocalTime dndStartTime;

    @Column(name = "dnd_end_time")
    private LocalTime dndEndTime;

    @Column(name = "preferred_language", length = 20)
    private String preferredLanguage;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (inAppEnabled == null) inAppEnabled = true;
        if (pushEnabled == null) pushEnabled = true;
        if (smsEnabled == null) smsEnabled = true;
        if (emailEnabled == null) emailEnabled = true;
        if (doNotDisturbEnabled == null) doNotDisturbEnabled = false;
    }
}
