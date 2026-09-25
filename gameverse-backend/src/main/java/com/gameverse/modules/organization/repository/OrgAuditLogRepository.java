package com.gameverse.modules.organization.repository;

import com.gameverse.modules.organization.entity.OrgAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrgAuditLogRepository extends JpaRepository<OrgAuditLog, String> {
    List<OrgAuditLog> findByOrganization_OrgIdOrderByCreatedAtDesc(String orgId);
}
