package com.gameverse.modules.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private String messageId;
    private String tournamentId;
    private String channelType;
    private String senderId;
    private String senderName;
    private String senderRole;
    private String content;
    private Boolean isPinned;
    private Boolean isSystem;
    private LocalDateTime createdAt;
    private Map<String, Integer> reactions; // emoji -> count
}
