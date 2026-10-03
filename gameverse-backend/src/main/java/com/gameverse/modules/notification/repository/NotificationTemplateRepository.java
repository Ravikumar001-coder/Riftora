package com.gameverse.modules.notification.repository;

import com.gameverse.modules.notification.entity.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, String> {
    List<NotificationTemplate> findByIsSystemTmplTrue();
    java.util.Optional<NotificationTemplate> findByTemplateCode(String templateCode);
}
