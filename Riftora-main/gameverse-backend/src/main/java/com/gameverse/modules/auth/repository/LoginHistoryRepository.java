package com.gameverse.modules.auth.repository;

import com.gameverse.modules.auth.entity.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, String> {
    List<LoginHistory> findByUserIdOrderByCreatedAtDesc(String userId);
}
