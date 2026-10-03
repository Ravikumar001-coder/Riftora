package com.gameverse.modules.notification.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.notification.dto.NotificationDto;
import com.gameverse.modules.notification.entity.Notification;
import com.gameverse.modules.notification.entity.NotificationDelivery;
import com.gameverse.modules.notification.entity.NotificationTemplate;
import com.gameverse.modules.notification.repository.NotificationDeliveryRepository;
import com.gameverse.modules.notification.repository.NotificationRepository;
import com.gameverse.modules.notification.repository.NotificationTemplateRepository;
import com.gameverse.core.websocket.WebSocketEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationDeliveryRepository deliveryRepository;
    private final NotificationTemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final WebSocketEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public Page<NotificationDto> getUserNotifications(String userId, boolean unreadOnly, Pageable pageable) {
        Page<Notification> notifications;
        if (unreadOnly) {
            notifications = notificationRepository.findByRecipient_UserIdAndIsReadFalseAndIsDeletedFalse(userId, pageable);
        } else {
            notifications = notificationRepository.findByRecipient_UserIdAndIsDeletedFalse(userId, pageable);
        }
        return notifications.map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipient_UserIdAndIsReadFalseAndIsDeletedFalse(userId);
    }

    @Transactional
    public void markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
                
        if (!notification.getRecipient().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Transactional
    public void deleteNotification(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
                
        if (!notification.getRecipient().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        
        notification.setIsDeleted(true);
        notification.setDeletedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Transactional
    public void sendSystemNotification(String userId, String templateCode, java.util.Map<String, String> variables) {
        User user = userRepository.findById(userId).orElseThrow();
        NotificationTemplate template = templateRepository.findByTemplateCode(templateCode)
                .orElseThrow(() -> new IllegalArgumentException("Template not found: " + templateCode));

        String title = template.getTitleTemplate();
        String body = template.getBodyTemplate();
        
        // Dynamic variable substitution e.g., {{team_name}}
        if (variables != null) {
            for (java.util.Map.Entry<String, String> entry : variables.entrySet()) {
                String placeholder = "{{" + entry.getKey() + "}}";
                if (title != null) title = title.replace(placeholder, entry.getValue());
                if (body != null) body = body.replace(placeholder, entry.getValue());
            }
        }

        Notification notification = new Notification();
        notification.setTemplate(template);
        notification.setRecipient(user);
        notification.setTitle(title);
        notification.setBody(body);
        notification = notificationRepository.save(notification);
        
        // Just mock in-app delivery
        NotificationDelivery delivery = new NotificationDelivery();
        delivery.setNotification(notification);
        delivery.setChannel(NotificationDelivery.NotificationChannel.in_app);
        delivery.setStatus(NotificationDelivery.DeliveryStatus.delivered);
        delivery.setDeliveredAt(LocalDateTime.now());
        deliveryRepository.save(delivery);
        
        // Push over WebSocket
        eventPublisher.sendToUser(userId, "/queue/notifications", mapToDto(notification));
    }

    private NotificationDto mapToDto(Notification entity) {
        return NotificationDto.builder()
                .notificationId(entity.getNotificationId())
                .title(entity.getTitle())
                .body(entity.getBody())
                .actionUrl(entity.getActionUrl())
                .tournamentId(entity.getTournament() != null ? entity.getTournament().getTournamentId() : null)
                .matchId(entity.getMatch() != null ? entity.getMatch().getMatchId() : null)
                .isRead(entity.getIsRead())
                .readAt(entity.getReadAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
