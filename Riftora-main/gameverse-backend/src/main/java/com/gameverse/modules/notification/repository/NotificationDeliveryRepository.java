package com.gameverse.modules.notification.repository;

import com.gameverse.modules.notification.entity.NotificationDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationDeliveryRepository extends JpaRepository<NotificationDelivery, String> {
    List<NotificationDelivery> findByNotification_NotificationId(String notificationId);
}
