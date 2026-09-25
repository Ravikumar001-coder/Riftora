package com.gameverse.modules.game.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicLinkedAccountDto {
    private String gameName;
    private String gameCode;
    private String inGameName;
    private String maskedUid;
}
