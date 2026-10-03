package com.gameverse.modules.game.repository;

import com.gameverse.modules.game.entity.BlacklistUid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlacklistUidRepository extends JpaRepository<BlacklistUid, String> {
    List<BlacklistUid> findByGame_GameIdAndUidIn(String gameId, List<String> uids);
}
