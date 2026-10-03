package com.gameverse.modules.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginHistory {

    @Id
    @UuidGenerator
    @Column(name = "history_id", length = 36, updatable = false, nullable = false)
    private String historyId;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "identifier", length = 255)
    private String identifier; // Email, mobile number, or username attempted

    @Enumerated(EnumType.STRING)
    @Column(name = "login_method", nullable = false)
    private LoginMethod loginMethod;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "is_success", nullable = false)
    private Boolean isSuccess;

    @Column(name = "failure_reason", length = 255)
    private String failureReason;

    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum LoginMethod {
        EMAIL, MOBILE, OAUTH
    }
}
