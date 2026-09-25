package com.gameverse.modules.match.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MatchSlotDto {
    private String slotId;
    private String matchId;
    private String registrationId;
    private String teamId;
    private String teamName;
    private Integer slotNumber;
    private Boolean isBye;
    private Boolean noShow;
    private LocalDateTime noShowAt;
    private String slotLabel;
}
