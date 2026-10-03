package com.gameverse.modules.chat.service;

import com.gameverse.core.security.JwtService;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.chat.dto.ChatMessageDto;
import com.gameverse.modules.chat.dto.SendChatMessageDto;
import com.gameverse.modules.chat.entity.ChatMessage;
import com.gameverse.modules.chat.entity.ChatMessageReaction;
import com.gameverse.modules.chat.repository.ChatMessageRepository;
import com.gameverse.modules.chat.dto.ChatModerationDto;
import com.gameverse.modules.chat.entity.ChatModerationLog;
import com.gameverse.modules.chat.entity.ChatRestriction;
import com.gameverse.modules.chat.entity.ChatSettings;
import com.gameverse.modules.chat.repository.ChatModerationLogRepository;
import com.gameverse.modules.chat.repository.ChatRestrictionRepository;
import com.gameverse.modules.chat.repository.ChatSettingsRepository;
import com.gameverse.modules.chat.repository.ChatMessageReactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageReactionRepository chatMessageReactionRepository;
    private final ChatSettingsRepository chatSettingsRepository;
    private final ChatRestrictionRepository chatRestrictionRepository;
    private final ChatModerationLogRepository chatModerationLogRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ProfanityFilterService profanityFilterService;

    @Transactional
    public ChatMessageDto saveMessage(String tournamentId, String channel, SendChatMessageDto dto) {
        String userId = "anonymous";
        String userName = "Guest";
        String role = "Viewer";

        if (dto.getToken() != null && jwtService.isTokenValid(dto.getToken())) {
            userId = jwtService.extractUserId(dto.getToken());
            var userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                userName = userOpt.get().getUsername();
                role = "User"; // Need a way to resolve tournament role in real life, fallback to User
            }
        } else {
            if ("announcements".equals(channel) || "competitor".equals(channel)) {
                throw new RuntimeException("Unauthorized for this channel");
            }
            if (dto.getGuestName() != null && !dto.getGuestName().trim().isEmpty()) {
                userName = dto.getGuestName().trim();
                userId = "guest-" + userName.toLowerCase().replaceAll("[^a-z0-9]", "");
            } else {
                throw new RuntimeException("Display name required for guest viewers");
            }
        }

        ChatSettings settings = chatSettingsRepository.findById(tournamentId)
                .orElseGet(() -> ChatSettings.builder().tournamentId(tournamentId).build());

        if (settings.getSubscribersOnlyMode() && userId.startsWith("guest-")) {
            throw new RuntimeException("Subscribers Only Mode is active. Please log in to chat.");
        }

        if (settings.getCompetitorOnlyMode() && !"User".equals(role) && !"Organizer".equals(role) && !"Admin".equals(role)) {
            // Check for actual registration in real life.
            throw new RuntimeException("Competitor Only Mode is active.");
        }

        Optional<ChatRestriction> restriction = userId.startsWith("guest-") 
            ? chatRestrictionRepository.findByTournamentIdAndGuestNameAndRestrictionType(tournamentId, userName, "BAN")
            : chatRestrictionRepository.findByTournamentIdAndUserIdAndRestrictionType(tournamentId, userId, "BAN");
            
        if (restriction.isPresent()) throw new RuntimeException("You are permanently banned from this chat.");

        Optional<ChatRestriction> mute = userId.startsWith("guest-") 
            ? chatRestrictionRepository.findByTournamentIdAndGuestNameAndRestrictionType(tournamentId, userName, "MUTE")
            : chatRestrictionRepository.findByTournamentIdAndUserIdAndRestrictionType(tournamentId, userId, "MUTE");
            
        if (mute.isPresent() && (mute.get().getExpiresAt() == null || mute.get().getExpiresAt().isAfter(LocalDateTime.now()))) {
            throw new RuntimeException("You are currently muted.");
        }

        if (settings.getSlowModeSeconds() > 0 && !role.equals("Organizer") && !role.equals("Admin")) {
            Optional<ChatMessage> lastMsg = userId.startsWith("guest-") 
                ? chatMessageRepository.findFirstByTournamentIdAndSenderNameOrderByCreatedAtDesc(tournamentId, userName)
                : chatMessageRepository.findFirstByTournamentIdAndSenderIdOrderByCreatedAtDesc(tournamentId, userId);
            
            if (lastMsg.isPresent()) {
                long secondsSince = java.time.Duration.between(lastMsg.get().getCreatedAt(), LocalDateTime.now()).getSeconds();
                if (secondsSince < settings.getSlowModeSeconds()) {
                    throw new RuntimeException("Slow mode is active. Please wait " + (settings.getSlowModeSeconds() - secondsSince) + " seconds.");
                }
            }
        }

        if (dto.getContent() == null || dto.getContent().trim().isEmpty()) {
            throw new RuntimeException("Message cannot be empty.");
        }
        if (dto.getContent().length() > 300) {
            throw new RuntimeException("Message cannot exceed 300 characters.");
        }

        if (profanityFilterService.containsProfanity(dto.getContent())) {
            throw new RuntimeException("Message contains profanity and was blocked.");
        }

        // For Announcements, enforce admin check here in the future
        // For Competitors, enforce registration check here in the future

        ChatMessage message = ChatMessage.builder()
                .tournamentId(tournamentId)
                .channelType(channel)
                .senderId(userId)
                .senderName(userName)
                .senderRole(role)
                .content(dto.getContent())
                .isPinned(false)
                .isDeleted(false)
                .isSystem(false)
                .build();

        chatMessageRepository.save(message);

        return ChatMessageDto.builder()
                .messageId(message.getMessageId())
                .tournamentId(message.getTournamentId())
                .channelType(message.getChannelType())
                .senderId(message.getSenderId())
                .senderName(message.getSenderName())
                .senderRole(message.getSenderRole())
                .content(message.getContent())
                .isPinned(message.getIsPinned())
                .isSystem(message.getIsSystem())
                .createdAt(message.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getHistory(String tournamentId, String channel) {
        // Last 30 days
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);
        List<ChatMessage> messages = chatMessageRepository.findByTournamentIdAndChannelTypeAndCreatedAtAfterOrderByCreatedAtAsc(tournamentId, channel, cutoff)
                .stream()
                .filter(m -> !m.getIsDeleted())
                .collect(Collectors.toList());
                
        List<String> messageIds = messages.stream().map(ChatMessage::getMessageId).collect(Collectors.toList());
        List<ChatMessageReaction> allReactions = chatMessageReactionRepository.findByMessageIdIn(messageIds);

        return messages.stream()
                .map(m -> {
                    Map<String, Integer> reactionCounts = new HashMap<>();
                    allReactions.stream()
                            .filter(r -> r.getMessageId().equals(m.getMessageId()))
                            .forEach(r -> reactionCounts.put(r.getEmoji(), reactionCounts.getOrDefault(r.getEmoji(), 0) + 1));

                    return ChatMessageDto.builder()
                            .messageId(m.getMessageId())
                            .tournamentId(m.getTournamentId())
                            .channelType(m.getChannelType())
                            .senderId(m.getSenderId())
                            .senderName(m.getSenderName())
                            .senderRole(m.getSenderRole())
                            .content(m.getContent())
                            .isPinned(m.getIsPinned())
                            .isSystem(m.getIsSystem())
                            .createdAt(m.getCreatedAt())
                            .reactions(reactionCounts)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleReaction(String messageId, String emoji, String token, String guestName) {
        String userId = "anonymous";
        if (token != null && jwtService.isTokenValid(token)) {
            userId = jwtService.extractUserId(token);
        } else if (guestName != null && !guestName.trim().isEmpty()) {
            userId = "guest-" + guestName.trim().toLowerCase().replaceAll("[^a-z0-9]", "");
        } else {
            throw new RuntimeException("Unauthorized to react");
        }

        Optional<ChatMessageReaction> existing = chatMessageReactionRepository.findByMessageIdAndUserIdAndEmoji(messageId, userId, emoji);
        if (existing.isPresent()) {
            chatMessageReactionRepository.delete(existing.get());
        } else {
            chatMessageReactionRepository.save(
                    ChatMessageReaction.builder()
                            .messageId(messageId)
                            .userId(userId)
                            .emoji(emoji)
                            .build()
            );
        }
    }

    @Transactional
    public void togglePin(String messageId, String token) {
        if (token == null || !jwtService.isTokenValid(token)) {
            throw new RuntimeException("Unauthorized to pin messages");
        }
        
        String userId = jwtService.extractUserId(token);
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || (userOpt.get().getOnboardingPath() != com.gameverse.modules.auth.entity.User.OnboardingPath.organizer && userOpt.get().getPlatformRole() != com.gameverse.modules.auth.entity.User.PlatformRole.super_admin)) {
            // Check specific tournament role in real application (Tournament Director or Referee)
            throw new RuntimeException("Only Directors and Referees can pin messages");
        }

        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getIsPinned()) {
            long pinnedCount = chatMessageRepository.findByTournamentIdAndChannelTypeAndCreatedAtAfterOrderByCreatedAtAsc(
                            message.getTournamentId(), message.getChannelType(), LocalDateTime.now().minusDays(30))
                    .stream()
                    .filter(m -> m.getIsPinned() && !m.getIsDeleted())
                    .count();
            if (pinnedCount >= 3) {
                throw new RuntimeException("Maximum 3 pinned messages allowed per channel");
            }
            message.setIsPinned(true);
        } else {
            message.setIsPinned(false);
        }
        chatMessageRepository.save(message);
    }

    @Transactional
    public ChatMessageDto sendSystemMessage(String tournamentId, String channel, String content) {
        ChatMessage message = ChatMessage.builder()
                .tournamentId(tournamentId)
                .channelType(channel)
                .senderId("system")
                .senderName("System")
                .senderRole("System")
                .content(content)
                .isPinned(false)
                .isDeleted(false)
                .isSystem(true)
                .build();

        chatMessageRepository.save(message);

        return ChatMessageDto.builder()
                .messageId(message.getMessageId())
                .tournamentId(message.getTournamentId())
                .channelType(message.getChannelType())
                .senderId(message.getSenderId())
                .senderName(message.getSenderName())
                .senderRole(message.getSenderRole())
                .content(message.getContent())
                .isPinned(message.getIsPinned())
                .isSystem(message.getIsSystem())
                .createdAt(message.getCreatedAt())
                .build();
    }

    @Transactional
    public void moderateChat(String tournamentId, String token, ChatModerationDto dto) {
        if (token == null || !jwtService.isTokenValid(token)) {
            throw new RuntimeException("Unauthorized");
        }

        String modId = jwtService.extractUserId(token);
        var modOpt = userRepository.findById(modId);
        if (modOpt.isEmpty() || (modOpt.get().getOnboardingPath() != com.gameverse.modules.auth.entity.User.OnboardingPath.organizer && modOpt.get().getPlatformRole() != com.gameverse.modules.auth.entity.User.PlatformRole.super_admin)) {
            throw new RuntimeException("Only Moderators can perform this action");
        }

        String actionType = dto.getActionType();
        String targetUserId = dto.getTargetUserId();
        String targetGuestName = dto.getTargetGuestName();
        String msgContent = null;

        if ("DELETE".equals(actionType)) {
            ChatMessage msg = chatMessageRepository.findById(dto.getMessageId())
                    .orElseThrow(() -> new RuntimeException("Message not found"));
            msg.setIsDeleted(true);
            chatMessageRepository.save(msg);
            msgContent = msg.getContent();
            targetUserId = msg.getSenderId();
            targetGuestName = msg.getSenderName();
        } else if ("WARN".equals(actionType)) {
            // Handled via WebSockets by Controller
        } else if ("MUTE".equals(actionType) || "BAN".equals(actionType)) {
            LocalDateTime expires = ("BAN".equals(actionType) || dto.getDurationMinutes() == null) 
                    ? null 
                    : LocalDateTime.now().plusMinutes(dto.getDurationMinutes());
            
            ChatRestriction res = ChatRestriction.builder()
                    .tournamentId(tournamentId)
                    .userId(targetUserId != null && !targetUserId.startsWith("guest-") ? targetUserId : null)
                    .guestName(targetGuestName)
                    .restrictionType(actionType)
                    .expiresAt(expires)
                    .reason(dto.getReason())
                    .build();
            chatRestrictionRepository.save(res);
        }

        ChatModerationLog log = ChatModerationLog.builder()
                .tournamentId(tournamentId)
                .moderatorId(modId)
                .targetUserId(targetUserId)
                .targetGuestName(targetGuestName)
                .actionType(actionType)
                .messageContent(msgContent)
                .build();
        chatModerationLogRepository.save(log);
    }

    @Transactional
    public void updateSettings(String tournamentId, String token, com.gameverse.modules.chat.dto.ChatSettingsDto dto) {
        if (token == null || !jwtService.isTokenValid(token)) throw new RuntimeException("Unauthorized");
        
        String modId = jwtService.extractUserId(token);
        var modOpt = userRepository.findById(modId);
        if (modOpt.isEmpty() || (modOpt.get().getOnboardingPath() != com.gameverse.modules.auth.entity.User.OnboardingPath.organizer && modOpt.get().getPlatformRole() != com.gameverse.modules.auth.entity.User.PlatformRole.super_admin)) {
            throw new RuntimeException("Only Directors can update chat settings");
        }

        ChatSettings settings = chatSettingsRepository.findById(tournamentId)
                .orElseGet(() -> ChatSettings.builder().tournamentId(tournamentId).build());

        if (dto.getSlowModeSeconds() != null) settings.setSlowModeSeconds(dto.getSlowModeSeconds());
        if (dto.getSubscribersOnlyMode() != null) settings.setSubscribersOnlyMode(dto.getSubscribersOnlyMode());
        if (dto.getCompetitorOnlyMode() != null) settings.setCompetitorOnlyMode(dto.getCompetitorOnlyMode());

        chatSettingsRepository.save(settings);
    }

    @Transactional(readOnly = true)
    public com.gameverse.modules.chat.dto.ChatSettingsDto getSettings(String tournamentId) {
        ChatSettings settings = chatSettingsRepository.findById(tournamentId)
                .orElseGet(() -> ChatSettings.builder()
                        .tournamentId(tournamentId)
                        .slowModeSeconds(0)
                        .subscribersOnlyMode(false)
                        .competitorOnlyMode(false)
                        .build());
                        
        return com.gameverse.modules.chat.dto.ChatSettingsDto.builder()
                .slowModeSeconds(settings.getSlowModeSeconds())
                .subscribersOnlyMode(settings.getSubscribersOnlyMode())
                .competitorOnlyMode(settings.getCompetitorOnlyMode())
                .build();
    }
}
