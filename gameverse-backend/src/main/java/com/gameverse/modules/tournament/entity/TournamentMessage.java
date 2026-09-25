package com.gameverse.modules.tournament.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "tournament_messages")
@Getter
@Setter
public class TournamentMessage {

    @Id
    @UuidGenerator
    @Column(name = "msg_id", length = 36, updatable = false, nullable = false)
    private String msgId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    private MessageType messageType;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Column(name = "body", columnDefinition = "TEXT", nullable = false)
    private String body;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Module 14: Announcements
    @Enumerated(EnumType.STRING)
    @Column(name = "recipient_scope")
    private RecipientScope recipientScope;

    @Column(name = "scope_target_id", length = 36)
    private String scopeTargetId;

    @Column(name = "scope_teams", columnDefinition = "JSON")
    private String scopeTeamsJson;

    @Column(name = "channels", columnDefinition = "JSON")
    private String channelsJson;

    @Column(name = "is_scheduled")
    private Boolean isScheduled;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private MessageStatus status;

    @Column(name = "recipient_count")
    private Integer recipientCount;

    @Column(name = "delivered_count")
    private Integer deliveredCount;

    @Column(name = "failed_count")
    private Integer failedCount;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = MessageStatus.draft;
        }
        if (isScheduled == null) {
            isScheduled = false;
        }
        if (recipientCount == null) recipientCount = 0;
        if (deliveredCount == null) deliveredCount = 0;
        if (failedCount == null) failedCount = 0;
    }

    public enum MessageType {
        announcement, pre_tournament, match_day
    }

    public enum RecipientScope {
        all_registered, all_checked_in, specific_match, specific_round, specific_teams, status_based
    }

    public enum MessageStatus {
        draft, scheduled, sending, sent, cancelled
    }
}
