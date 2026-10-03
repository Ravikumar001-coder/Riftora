package com.gameverse.modules.match.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DisqualificationDto {
    private String dqId;
    private String tournamentId;
    private String registrationId;
    private String teamName;
    private String matchId;
    private String recommendedByUserId;
    private String confirmedByUserId;
    private String dqScope;
    private String reason;
    private String evidenceUrl;
    private String status;
    private LocalDateTime recommendedAt;
    private LocalDateTime confirmedAt;
}
