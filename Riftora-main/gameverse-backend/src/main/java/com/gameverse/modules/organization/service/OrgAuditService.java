package com.gameverse.modules.organization.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.organization.entity.OrgAuditLog;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrgAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrgAuditService {

    private final OrgAuditLogRepository orgAuditLogRepository;

    @Transactional(readOnly = true)
    public List<OrgAuditLog> getAuditLogsForOrganization(String orgId) {
        return orgAuditLogRepository.findByOrganization_OrgIdOrderByCreatedAtDesc(orgId);
    }

    @Transactional
    public void logEvent(Organization org, User actor, User targetUser, OrgAuditLog.EventType eventType, Map<String, Object> metadata) {
        OrgAuditLog log = new OrgAuditLog();
        log.setOrganization(org);
        log.setActor(actor);
        log.setTargetUser(targetUser);
        log.setEventType(eventType);
        log.setMetadata(metadata);
        
        orgAuditLogRepository.save(log);
    }
}
