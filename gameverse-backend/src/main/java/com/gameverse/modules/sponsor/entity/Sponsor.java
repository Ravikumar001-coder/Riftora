package com.gameverse.modules.sponsor.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sponsors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sponsor {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "sponsor_id", length = 36, updatable = false, nullable = false)
    private String id;

    @Column(name = "org_id", length = 36, nullable = false)
    private String orgId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "logo_url", nullable = false, length = 500)
    private String logoUrl;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private SponsorTier tier;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
