package com.gameverse.modules.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verifications")
@Getter
@Setter
public class EmailVerification {

    @Id
    @UuidGenerator
    @Column(name = "token", length = 36, updatable = false, nullable = false)
    private String token;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @Column(name = "email", length = 255, nullable = false)
    private String email;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "is_used")
    private Boolean isUsed = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
