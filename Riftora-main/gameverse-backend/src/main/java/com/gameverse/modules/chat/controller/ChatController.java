package com.gameverse.modules.chat.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.chat.dto.ChatMessageDto;
import com.gameverse.modules.chat.dto.ReactionDto;
import com.gameverse.modules.chat.dto.SendChatMessageDto;
import com.gameverse.modules.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import com.gameverse.modules.chat.dto.ChatSettingsDto;
import com.gameverse.modules.chat.dto.ChatModerationDto;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tournaments/{tournamentId}/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{channel}")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getChatHistory(
            @PathVariable String tournamentId,
            @PathVariable String channel) {
        
        List<ChatMessageDto> history = chatService.getHistory(tournamentId, channel);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<ChatSettingsDto>> getSettings(
            @PathVariable String tournamentId) {
        ChatSettingsDto settings = chatService.getSettings(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<Void>> updateSettings(
            @PathVariable String tournamentId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChatSettingsDto dto) {
        String token = authHeader.replace("Bearer ", "");
        chatService.updateSettings(tournamentId, token, dto);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{channel}/moderate")
    public ResponseEntity<ApiResponse<Void>> moderateChat(
            @PathVariable String tournamentId,
            @PathVariable String channel,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChatModerationDto dto) {
        String token = authHeader.replace("Bearer ", "");
        chatService.moderateChat(tournamentId, token, dto);
        
        if ("DELETE".equals(dto.getActionType())) {
            String topic = String.format("/topic/tournament.%s.chat.%s.reactions", tournamentId, channel); // Reuse reaction refetch mechanism
            messagingTemplate.convertAndSend(topic, dto.getMessageId());
        } else if ("WARN".equals(dto.getActionType()) && dto.getTargetUserId() != null) {
            String userQueue = String.format("/queue/chat.warnings");
            messagingTemplate.convertAndSendToUser(dto.getTargetUserId(), userQueue, dto.getReason());
        }

        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @MessageMapping("/chat/{tournamentId}/{channel}/send")
    public void sendMessage(
            @DestinationVariable String tournamentId,
            @DestinationVariable String channel,
            @Payload SendChatMessageDto messageDto) {
        
        try {
            ChatMessageDto savedMessage = chatService.saveMessage(tournamentId, channel, messageDto);
            String topic = String.format("/topic/tournament.%s.chat.%s", tournamentId, channel);
            messagingTemplate.convertAndSend(topic, savedMessage);
        } catch (Exception e) {
            // Log error or send error back to user queue
            System.err.println("Failed to send chat message: " + e.getMessage());
        }
    }

    @MessageMapping("/chat/{tournamentId}/{channel}/react/{messageId}")
    public void toggleReaction(
            @DestinationVariable String tournamentId,
            @DestinationVariable String channel,
            @DestinationVariable String messageId,
            @Payload ReactionDto reactionDto) {
        
        try {
            chatService.toggleReaction(messageId, reactionDto.getEmoji(), reactionDto.getToken(), reactionDto.getGuestName());
            // Broadcast something to trigger a refresh or send a specific reaction event
            String topic = String.format("/topic/tournament.%s.chat.%s.reactions", tournamentId, channel);
            messagingTemplate.convertAndSend(topic, messageId); 
            // In a real app, send back the updated reaction counts, but for now we'll just signal a refresh
        } catch (Exception e) {
            System.err.println("Failed to toggle reaction: " + e.getMessage());
        }
    }

    @MessageMapping("/chat/{tournamentId}/{channel}/pin/{messageId}")
    public void togglePin(
            @DestinationVariable String tournamentId,
            @DestinationVariable String channel,
            @DestinationVariable String messageId,
            @Payload ReactionDto reactionDto) { // Reusing ReactionDto for passing the token easily
        
        try {
            chatService.togglePin(messageId, reactionDto.getToken());
            // Broadcast something to trigger a refresh
            String topic = String.format("/topic/tournament.%s.chat.%s.reactions", tournamentId, channel); // Reusing the reactions topic to trigger a refetch
            messagingTemplate.convertAndSend(topic, messageId); 
        } catch (Exception e) {
            System.err.println("Failed to toggle pin: " + e.getMessage());
        }
    }
}
