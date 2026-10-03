package com.gameverse.modules.auth.repository;

import com.gameverse.modules.auth.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, String> {
    Optional<OtpVerification> findByMobileNumberAndIsVerifiedFalseOrderByCreatedAtDesc(String mobileNumber);
    long countByMobileNumberAndCreatedAtAfter(String mobileNumber, LocalDateTime createdAt);
}
