package com.gameverse.modules.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserNotificationPreferenceDto {
    private Boolean inAppEnabled;
    private Boolean pushEnabled;
    private Boolean smsEnabled;
    private Boolean emailEnabled;
    private Boolean doNotDisturbEnabled;
    private LocalTime dndStartTime;
    private LocalTime dndEndTime;
}
