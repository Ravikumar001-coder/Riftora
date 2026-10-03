package com.gameverse.modules.notification.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_deliveries")
@Getter
@Setter
public class NotificationDelivery {

    @Id
    @UuidGenerator
    @Column(name = "delivery_id", length = 36, updatable = false, nullable = false)
    private String deliveryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;

    @Enumerated(EnumType.STRING)
    @Column(name = "channel", nullable = false)
    private NotificationChannel channel;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeliveryStatus status;

    @Column(name = "gateway_used", length = 50)
    private String gatewayUsed;

    @Column(name = "gateway_message_id", length = 200)
    private String gatewayMessageId;

    @Column(name = "attempt_count")
    private Integer attemptCount;

    @Column(name = "last_attempt_at")
    private LocalDateTime lastAttemptAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @PrePersist
    protected void onCreate() {
        if (status == null) status = DeliveryStatus.pending;
        if (attemptCount == null) attemptCount = 0;
    }

    public enum NotificationChannel {
        in_app, push, sms, email
    }

    public enum DeliveryStatus {
        pending, sent, delivered, failed
    }
}
