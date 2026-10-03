package com.gameverse.modules.audit.controller;

import com.gameverse.modules.audit.dto.AuditLogDto;
import com.gameverse.modules.audit.entity.AuditLog;
import com.gameverse.modules.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/tournaments/{tournamentId}/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin')")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<AuditLogDto>> getTournamentAuditLogs(
            @PathVariable String tournamentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        Page<AuditLog> auditLogs = auditLogRepository.findByTournament_TournamentIdOrderByCreatedAtDesc(
                tournamentId, PageRequest.of(page, size));
        
        Page<AuditLogDto> dtos = auditLogs.map(log -> {
            AuditLogDto dto = new AuditLogDto();
            dto.setLogId(log.getLogId());
            dto.setActorId(log.getActor() != null ? log.getActor().getUserId() : null);
            dto.setActorUsername(log.getActor() != null ? log.getActor().getUsername() : "System");
            dto.setEntityType(log.getEntityType());
            dto.setActionCode(log.getActionCode());
            dto.setActionDetails(log.getActionDetails());
            dto.setIpAddress(log.getIpAddress());
            dto.setCreatedAt(log.getCreatedAt());
            return dto;
        });

        return ResponseEntity.ok(dtos);
    }
}
