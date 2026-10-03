package com.gameverse.modules.audit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gameverse.modules.audit.entity.ImmutableAuditLog;
import com.gameverse.modules.audit.repository.ImmutableAuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImmutableAuditService {

    private final ImmutableAuditLogRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public void logEvent(String eventType, String actorId, String actorRole, String targetType, String targetId, Object eventData, String ipAddress, String userAgent) {
        String previousHash = getLatestHash();
        LocalDateTime now = LocalDateTime.now();
        
        String eventDataJson = "{}";
        try {
            if (eventData != null) {
                eventDataJson = objectMapper.writeValueAsString(eventData);
            }
        } catch (Exception e) {
            log.error("Failed to serialize event data", e);
        }

        String rawData = eventType + actorId + actorRole + targetType + targetId + eventDataJson + ipAddress + userAgent + previousHash + now.toString();
        String hash = generateHash(rawData);

        ImmutableAuditLog auditLog = ImmutableAuditLog.builder()
                .eventType(eventType)
                .actorId(actorId)
                .actorRole(actorRole)
                .targetType(targetType)
                .targetId(targetId)
                .eventData(eventDataJson)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .previousHash(previousHash)
                .hash(hash)
                .createdAt(now)
                .build();

        repository.save(auditLog);
    }

    private String getLatestHash() {
        Optional<ImmutableAuditLog> latest = repository.findLatestLog();
        return latest.map(ImmutableAuditLog::getHash).orElse("0000000000000000000000000000000000000000000000000000000000000000");
    }

    private String generateHash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    @Transactional(readOnly = true)
    public Page<ImmutableAuditLog> getLogsByTarget(String targetType, String targetId, Pageable pageable) {
        return repository.findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType, targetId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ImmutableAuditLog> getLogsForTournament(String tournamentId, Pageable pageable) {
        // Here we assume tournament events have target_id = tournamentId, or they can be fetched via eventData if needed
        return repository.findByTargetIdOrderByCreatedAtDesc(tournamentId, pageable);
    }
}
