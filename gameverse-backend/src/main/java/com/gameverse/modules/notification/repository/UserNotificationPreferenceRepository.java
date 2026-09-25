package com.gameverse.modules.notification.repository;

import com.gameverse.modules.notification.entity.UserNotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserNotificationPreferenceRepository extends JpaRepository<UserNotificationPreference, String> {
    Optional<UserNotificationPreference> findByUser_UserId(String userId);
}
