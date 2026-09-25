package com.gameverse.modules.notification.repository;

import com.gameverse.modules.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    Page<Notification> findByRecipient_UserIdAndIsDeletedFalse(String userId, Pageable pageable);
    
    Page<Notification> findByRecipient_UserIdAndIsReadFalseAndIsDeletedFalse(String userId, Pageable pageable);
    
    long countByRecipient_UserIdAndIsReadFalseAndIsDeletedFalse(String userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.recipient.userId = :userId AND n.isRead = false AND n.isDeleted = false")
    void markAllAsReadByUserId(String userId);
}
