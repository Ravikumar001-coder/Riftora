package com.gameverse.modules.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendChatMessageDto {
    @NotBlank
    @Size(max = 300, message = "Message cannot exceed 300 characters")
    private String content;
    
    private String token; // Optional if passing token in payload instead of header
    
    @Size(max = 50, message = "Guest name cannot exceed 50 characters")
    private String guestName;
}
