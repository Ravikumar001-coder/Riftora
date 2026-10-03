package com.gameverse.modules.chat.repository;

import com.gameverse.modules.chat.entity.ChatSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatSettingsRepository extends JpaRepository<ChatSettings, String> {
}
