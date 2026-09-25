package com.gameverse.modules.audit.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.audit.dto.ImmutableAuditLogDto;
import com.gameverse.modules.audit.entity.ImmutableAuditLog;
import com.gameverse.modules.audit.service.ImmutableAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tournaments/{tournamentId}/audit")
public class ImmutableAuditController {

    private final ImmutableAuditService auditService;
    private final ObjectMapper objectMapper;

    public ImmutableAuditController(ImmutableAuditService auditService) {
        this.auditService = auditService;
        this.objectMapper = new ObjectMapper();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<Page<ImmutableAuditLogDto>>> getTournamentAuditLogs(
            @PathVariable String tournamentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        Page<ImmutableAuditLog> logs = auditService.getLogsForTournament(tournamentId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(logs.map(this::mapToDto)));
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<byte[]> exportTournamentAuditLog(@PathVariable String tournamentId) {
        Page<ImmutableAuditLog> logs = auditService.getLogsForTournament(tournamentId, PageRequest.of(0, 10000)); // Export up to 10k logs
        
        StringBuilder csv = new StringBuilder("Official Audit Record\n");
        csv.append("Event ID,Timestamp,Event Type,Actor ID,Role,Target Type,Target ID,Data,IP Address,Hash\n");
        
        for (ImmutableAuditLog log : logs) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s,\"%s\",%s,%s\n",
                    log.getEventId(),
                    log.getCreatedAt(),
                    log.getEventType(),
                    log.getActorId(),
                    log.getActorRole(),
                    log.getTargetType(),
                    log.getTargetId(),
                    log.getEventData().replace("\"", "\"\""), // Escape quotes
                    log.getIpAddress(),
                    log.getHash()
            ));
        }

        byte[] csvBytes = csv.toString().getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "audit_log_" + tournamentId + ".csv");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }

    private ImmutableAuditLogDto mapToDto(ImmutableAuditLog entity) {
        ImmutableAuditLogDto dto = new ImmutableAuditLogDto();
        dto.setEventId(entity.getEventId());
        dto.setEventType(entity.getEventType());
        dto.setActorId(entity.getActorId());
        dto.setActorRole(entity.getActorRole());
        dto.setTargetType(entity.getTargetType());
        dto.setTargetId(entity.getTargetId());
        
        try {
            if (entity.getEventData() != null) {
                dto.setEventData(objectMapper.readTree(entity.getEventData()));
            }
        } catch (JsonProcessingException e) {
            // fallback
            dto.setEventData(entity.getEventData());
        }
        
        dto.setIpAddress(entity.getIpAddress());
        dto.setUserAgent(entity.getUserAgent());
        dto.setHash(entity.getHash());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
