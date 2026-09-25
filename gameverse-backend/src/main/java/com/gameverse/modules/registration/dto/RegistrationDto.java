package com.gameverse.modules.registration.dto;

import com.gameverse.modules.registration.entity.Registration;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RegistrationDto {
    private String registrationId;
    private String tournamentId;
    private String tournamentName;
    private String tournamentSlug;
    
    private String teamId;
    private String teamName;
    private String teamTag;
    private String teamLogo;
    
    private String captainUserId;
    private String captainName;
    private String captainUsername;
    private String captainEmail;
    
    private String referenceNumber;
    private Registration.RegistrationStatus status;
    private Boolean rulesAgreed;
    private Registration.FlagScore flagScore;
    
    private String correctionNotes;
    private String rejectionReason;
    private Integer memberCount;
    
    private LocalDateTime createdAt;
    private LocalDateTime reservationExpiresAt;
    private Boolean isWaitlistRequest;
}
