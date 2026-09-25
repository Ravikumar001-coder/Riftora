package com.gameverse.modules.audit.repository;

import com.gameverse.modules.audit.entity.ImmutableAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImmutableAuditLogRepository extends JpaRepository<ImmutableAuditLog, String> {
    
    @Query("SELECT l FROM ImmutableAuditLog l ORDER BY l.createdAt DESC LIMIT 1")
    Optional<ImmutableAuditLog> findLatestLog();

    Page<ImmutableAuditLog> findByTargetIdOrderByCreatedAtDesc(String targetId, Pageable pageable);
    
    Page<ImmutableAuditLog> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(String targetType, String targetId, Pageable pageable);
    
    // For general tournament viewing (if tournament_id is stored in target_id or event_data)
    // Alternatively, just query by target_id if we assume tournament is the target, or do a custom query
}
