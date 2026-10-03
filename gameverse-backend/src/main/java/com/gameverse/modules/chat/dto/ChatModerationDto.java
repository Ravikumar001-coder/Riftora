package com.gameverse.modules.chat.dto;

import lombok.Data;

@Data
public class ChatModerationDto {
    private String targetUserId;
    private String targetGuestName;
    private String actionType; // DELETE, WARN, MUTE, BAN
    private String messageId; // Optional, for DELETE
    private Integer durationMinutes; // For MUTE
    private String reason;
}
