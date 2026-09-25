package com.gameverse.modules.game.repository;

import com.gameverse.modules.game.entity.LinkedGameAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LinkedGameAccountRepository extends JpaRepository<LinkedGameAccount, String> {
    List<LinkedGameAccount> findByUser_UserId(String userId);
    List<LinkedGameAccount> findByUser_Username(String username);
    Optional<LinkedGameAccount> findByUser_UserIdAndGame_GameId(String userId, String gameId);
    boolean existsByUser_UserIdAndGame_GameIdAndInGameUid(String userId, String gameId, String inGameUid);
}
