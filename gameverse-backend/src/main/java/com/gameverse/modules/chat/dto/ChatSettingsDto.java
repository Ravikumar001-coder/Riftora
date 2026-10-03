package com.gameverse.modules.chat.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSettingsDto {
    private Integer slowModeSeconds;
    private Boolean subscribersOnlyMode;
    private Boolean competitorOnlyMode;
}
