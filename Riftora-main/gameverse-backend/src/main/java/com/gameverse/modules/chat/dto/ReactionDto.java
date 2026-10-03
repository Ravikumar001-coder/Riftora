package com.gameverse.modules.chat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReactionDto {
    @NotBlank
    private String emoji;
    private String token; // Optional if passing token in payload instead of header
    private String guestName;
}
