package com.gameverse.modules.game.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkedGameAccountDto {
    private String linkedId;
    private String gameId;
    private String gameName;
    private String gameCode;
    private String inGameUid;
    private String inGameName;
    private Boolean isPrimary;
    private String status;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;
    private String verificationMethod;
    private String verificationCode;
}
