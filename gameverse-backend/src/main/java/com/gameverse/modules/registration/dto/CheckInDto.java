package com.gameverse.modules.registration.dto;

import com.gameverse.modules.registration.entity.CheckIn.CheckinType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CheckInDto {
    private String checkinId;
    private String registrationId;
    private String tournamentId;
    private String teamName;
    private String checkedInByUserId;
    private String checkedInByUserName;
    private CheckinType checkinType;
    private LocalDateTime checkinAt;
    private String ipAddress;
}
