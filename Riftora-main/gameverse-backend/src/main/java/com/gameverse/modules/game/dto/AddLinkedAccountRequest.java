package com.gameverse.modules.game.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddLinkedAccountRequest {
    @NotBlank(message = "Game ID is required")
    private String gameId;

    @NotBlank(message = "In-game UID is required")
    private String inGameUid;

    private String inGameName;
}
