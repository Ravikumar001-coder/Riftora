package com.gameverse.modules.match.dto;

import lombok.Data;

@Data
public class MatchSlotUpdateDto {
    private Integer slotNumber;
    private String teamId;
    private String slotLabel;
}
