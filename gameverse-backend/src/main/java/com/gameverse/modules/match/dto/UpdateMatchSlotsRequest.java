package com.gameverse.modules.match.dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateMatchSlotsRequest {
    private List<MatchSlotUpdateDto> slots;
}
