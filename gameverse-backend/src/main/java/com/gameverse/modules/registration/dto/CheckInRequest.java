package com.gameverse.modules.registration.dto;

import lombok.Data;

@Data
public class CheckInRequest {
    private String registrationId;
    private String tournamentId;
}
