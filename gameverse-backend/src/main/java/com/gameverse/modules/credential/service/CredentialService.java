package com.gameverse.modules.credential.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.credential.dto.CreateCredentialRequest;
import com.gameverse.modules.credential.dto.CredentialLogDto;
import com.gameverse.modules.credential.dto.RoomCredentialDto;
import com.gameverse.modules.credential.dto.RoomCredentialViewDto;
import com.gameverse.modules.credential.dto.RotateCredentialRequest;
import com.gameverse.modules.credential.entity.CredentialLog;
import com.gameverse.modules.credential.entity.RoomCredential;
import com.gameverse.modules.credential.repository.CredentialLogRepository;
import com.gameverse.modules.credential.repository.RoomCredentialRepository;
import com.gameverse.modules.dispute.entity.Dispute;
import com.gameverse.modules.dispute.repository.DisputeRepository;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.match.entity.MatchSlot;
import com.gameverse.modules.match.repository.MatchRepository;
import com.gameverse.modules.match.repository.MatchSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

import com.gameverse.core.websocket.WebSocketEventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class CredentialService {

    private final RoomCredentialRepository credentialRepository;
    private final CredentialLogRepository logRepository;
    private final MatchRepository matchRepository;
    private final MatchSlotRepository matchSlotRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final WebSocketEventPublisher eventPublisher;
    private final DisputeRepository disputeRepository;
    
    private static final Logger log = LoggerFactory.getLogger(CredentialService.class);

    @Transactional
    public RoomCredentialDto addCredential(String userId, CreateCredentialRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        RoomCredential credential = new RoomCredential();
        credential.setMatch(match);
        credential.setEnteredBy(user);
        
        // Encrypt credentials at rest
        credential.setRoomIdEncrypted(encryptionService.encrypt(request.getRoomId()));
        credential.setPasswordEncrypted(encryptionService.encrypt(request.getPassword()));
        credential.setEncryptionKeyRef(encryptionService.getKeyReference());
        
        credential.setReleaseMode(request.getReleaseMode());
        credential.setScheduledReleaseAt(request.getScheduledReleaseAt());
        credential.setMatchStartMinusXMinutes(request.getMatchStartMinusXMinutes());
        credential.setMaxViews(request.getMaxViews());
        
        credential.setEntryHash(hashEntry(request.getRoomId(), request.getPassword()));
        
        credential = credentialRepository.save(credential);
        
        Map<String, Object> metadata = new HashMap<>();
        if (request.getScheduledReleaseAt() != null) {
            metadata.put("scheduledReleaseAt", request.getScheduledReleaseAt().toString());
        }
        metadata.put("releaseMode", request.getReleaseMode().name());
        
        logActionWithMeta(credential, user, match, CredentialLog.Action.entered, null, null, null, metadata);

        if (request.isReleaseImmediately()) {
            performRelease(credential, user);
        }

        return mapToDto(credential);
    }

    @Transactional
    public List<RoomCredentialDto> addCredentialsBulk(String userId, List<CreateCredentialRequest> requests) {
        return requests.stream()
                .map(req -> addCredential(userId, req))
                .collect(Collectors.toList());
    }

    @Transactional
    public RoomCredentialViewDto getMatchCredential(String userId, String matchId, String ipAddress, String userAgent, String deviceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
                
        // FR-08-020: Rate limit access - max 10 views per minute per user per match
        long recentViews = logRepository.countRecentViews(userId, matchId, LocalDateTime.now().minusMinutes(1));
        if (recentViews >= 10) {
            throw new RuntimeException("Rate limit exceeded: You have requested credentials too many times recently. Please wait a minute.");
        }

        // Only active credentials
        List<RoomCredential> credentials = credentialRepository.findByMatch_MatchIdAndIsActiveTrue(match.getMatchId());
        if (credentials.isEmpty()) {
            throw new RuntimeException("No active credential found for match");
        }
        RoomCredential credential = credentials.get(0);

        // Check if released
        boolean isReleased = credential.getReleasedAt() != null && !credential.getReleasedAt().isAfter(LocalDateTime.now());

        // Authorization checks
        boolean isTournamentStaff = checkTournamentStaff(user, match);
        boolean isParticipant = false;

        if (!isTournamentStaff) {
            // Only check participant if not staff
            if (!isReleased) {
                throw new RuntimeException("Credentials have not been released yet");
            }
            
            // Check if user is captain or player of a team in this match
            List<MatchSlot> slots = matchSlotRepository.findByMatch_MatchId(match.getMatchId());
            isParticipant = slots.stream().anyMatch(slot -> {
                if (slot.getTeam() != null) {
                    if (slot.getTeam().getCaptain().getUserId().equals(userId)) return true;
                    // To do: check if user is a member of the team
                }
                return false;
            });

            if (!isParticipant) {
                throw new RuntimeException("Unauthorized: You are not assigned to this match");
            }
            
            // Enforce max views if set
            if (credential.getMaxViews() != null) {
                long currentViews = logRepository.findByCredential_CredentialId(credential.getCredentialId()).stream()
                        .filter(l -> l.getUser().getUserId().equals(userId) && l.getAction() == CredentialLog.Action.viewed)
                        .count();
                        
                if (currentViews >= credential.getMaxViews()) {
                    throw new RuntimeException("Maximum view limit reached for these credentials.");
                }
            }
        }

        // Check if locked or completed
        if (match.getStatus() == Match.MatchStatus.completed && !isTournamentStaff) {
            return RoomCredentialViewDto.builder()
                    .matchId(matchId)
                    .isLocked(true)
                    .isMatchCompleted(true)
                    .build();
        }
        
        if (Boolean.TRUE.equals(credential.getIsLocked()) && !isTournamentStaff) {
            return RoomCredentialViewDto.builder()
                    .matchId(matchId)
                    .isLocked(true)
                    .build();
        }

        // Decrypt
        String roomId = encryptionService.decrypt(credential.getRoomIdEncrypted());
        String password = encryptionService.decrypt(credential.getPasswordEncrypted());

        logActionWithMeta(credential, user, match, CredentialLog.Action.viewed, ipAddress, userAgent, deviceId, null);

        Integer viewsRemaining = null;
        if (credential.getMaxViews() != null && !isTournamentStaff) {
            long currentViews = logRepository.findByCredential_CredentialId(credential.getCredentialId()).stream()
                    .filter(l -> l.getUser().getUserId().equals(userId) && l.getAction() == CredentialLog.Action.viewed)
                    .count();
            // Since we just logged the view, currentViews already includes it.
            viewsRemaining = (int) (credential.getMaxViews() - currentViews);
        }

        return RoomCredentialViewDto.builder()
                .roomId(roomId)
                .password(password)
                .matchId(matchId)
                .maxViews(credential.getMaxViews())
                .viewsRemaining(viewsRemaining)
                .isLocked(credential.getIsLocked())
                .build();
    }
    
    @Transactional(readOnly = true)
    public List<CredentialLogDto> getCredentialLogs(String userId, String matchId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (!checkTournamentStaff(user, match)) {
            throw new RuntimeException("Unauthorized: Only tournament staff can view credential logs");
        }

        return logRepository.findByMatch_MatchIdOrderByCreatedAtDesc(matchId)
                .stream()
                .map(log -> CredentialLogDto.builder()
                        .logId(log.getLogId())
                        .matchId(matchId)
                        .userId(log.getUser().getUserId())
                        .userRole(log.getUser().getPlatformRole() != null ? log.getUser().getPlatformRole().name() : "PLAYER")
                        .action(log.getAction())
                        .ipAddress(log.getIpAddress())
                        .userAgent(log.getUserAgent())
                        .deviceId(log.getDeviceId())
                        .timestamp(log.getCreatedAt())
                        .metadata(log.getMetadata())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomCredentialDto> getCredentialHistory(String userId, String matchId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (!checkTournamentStaff(user, match)) {
            throw new RuntimeException("Unauthorized: Only tournament staff can view credential history");
        }

        return credentialRepository.findByMatch_MatchIdOrderByCreatedAtDesc(matchId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void logCopyCredential(String userId, String matchId, String fieldCopied) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        List<RoomCredential> credentials = credentialRepository.findByMatch_MatchIdAndIsActiveTrue(match.getMatchId());
        if (credentials.isEmpty()) return;

        RoomCredential credential = credentials.get(0);
        logAction(credential, user, match, CredentialLog.Action.copied);
    }
    
    @Transactional
    public void manualRelease(String credentialId, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RoomCredential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new RuntimeException("Credential not found"));
                
        if (credential.getReleasedAt() != null) {
            throw new RuntimeException("Credential already released");
        }
        
        performRelease(credential, user);
    }
    
    @Transactional
    public void manualLock(String credentialId, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RoomCredential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new RuntimeException("Credential not found"));
                
        Match match = credential.getMatch();
        
        if (!checkTournamentStaff(user, match)) {
            throw new RuntimeException("Unauthorized: Only tournament staff can lock credentials");
        }
        
        if (match.getStatus() != Match.MatchStatus.in_progress && match.getStatus() != Match.MatchStatus.completed) {
            throw new RuntimeException("Match has not started yet");
        }
        
        credential.setIsLocked(true);
        credential.setLockedAt(LocalDateTime.now());
        credentialRepository.save(credential);
        
        logAction(credential, user, match, CredentialLog.Action.locked);
        
        // Notify Team Captains
        List<MatchSlot> slots = matchSlotRepository.findByMatch_MatchId(match.getMatchId());
        
        for (MatchSlot slot : slots) {
            if (slot.getTeam() != null && slot.getTeam().getCaptain() != null) {
                User captain = slot.getTeam().getCaptain();
                
                Map<String, Object> payload = new HashMap<>();
                payload.put("type", "CREDENTIAL_LOCKED");
                payload.put("matchId", match.getMatchId());
                payload.put("message", "Room credentials for Match " + match.getMatchNumber() + " have been locked.");
                
                eventPublisher.sendToUserQueue(captain.getUserId(), "/queue/notifications", payload);
            }
        }
    }
    
    @Transactional
    public void processAutoLocking() {
        List<RoomCredential> candidates = credentialRepository.findByIsActiveTrueAndIsLockedFalse();
        
        for (RoomCredential credential : candidates) {
            Match match = credential.getMatch();
            
            // Skip if match is voided.
            if (match.getStatus() == Match.MatchStatus.voided) {
                continue;
            }
            
            // If match is completed, unconditionally lock
            if (match.getStatus() == Match.MatchStatus.completed) {
                credential.setIsLocked(true);
                credential.setLockedAt(LocalDateTime.now());
                credentialRepository.save(credential);
                
                User actionUser = match.getTournament().getCreatedBy();
                logActionWithMeta(credential, actionUser, match, CredentialLog.Action.locked, "system", "match-completed-lock", null, null);
                continue;
            }
            
            com.gameverse.modules.tournament.entity.Tournament t = match.getTournament();
            if (Boolean.TRUE.equals(t.getAutoLockCredentials())) {
                int minsAfterStart = t.getAutoLockMinsAfterStart() != null ? t.getAutoLockMinsAfterStart() : 10;
                
                LocalDateTime threshold = match.getScheduledStart().plusMinutes(minsAfterStart);
                if (LocalDateTime.now().isAfter(threshold)) {
                    
                    credential.setIsLocked(true);
                    credential.setLockedAt(LocalDateTime.now());
                    credentialRepository.save(credential);
                    
                    User actionUser = match.getTournament().getCreatedBy();
                    logActionWithMeta(credential, actionUser, match, CredentialLog.Action.locked, "system", "auto-lock job", null, null);
                    
                    List<MatchSlot> slots = matchSlotRepository.findByMatch_MatchId(match.getMatchId());
                    for (MatchSlot slot : slots) {
                        if (slot.getTeam() != null && slot.getTeam().getCaptain() != null) {
                            User captain = slot.getTeam().getCaptain();
                            Map<String, Object> payload = new HashMap<>();
                            payload.put("type", "CREDENTIAL_LOCKED");
                            payload.put("matchId", match.getMatchId());
                            payload.put("message", "Room credentials for Match " + match.getMatchNumber() + " have been auto-locked.");
                            eventPublisher.sendToUserQueue(captain.getUserId(), "/queue/notifications", payload);
                        }
                    }
                }
            }
        }
    }
    
    @Transactional
    public RoomCredentialDto rotateCredential(String credentialId, String userId, RotateCredentialRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoomCredential oldCredential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        Match match = oldCredential.getMatch();
        
        if (!checkTournamentStaff(user, match)) {
            throw new RuntimeException("Unauthorized: Only tournament staff can rotate credentials");
        }
        
        if (match.getStatus() == Match.MatchStatus.completed) {
            throw new RuntimeException("Cannot rotate credentials for a completed match");
        }
        
        // Invalidate old credential
        oldCredential.setIsActive(false);
        oldCredential.setIsRevoked(true);
        oldCredential.setRevokedAt(LocalDateTime.now());
        oldCredential.setRevokeReason(request.getReason());
        credentialRepository.save(oldCredential);

        // Create new credential
        RoomCredential newCredential = new RoomCredential();
        newCredential.setMatch(match);
        newCredential.setEnteredBy(user);
        newCredential.setRotatedFrom(oldCredential);
        
        // Encrypt new credentials
        newCredential.setRoomIdEncrypted(encryptionService.encrypt(request.getRoomId()));
        newCredential.setPasswordEncrypted(encryptionService.encrypt(request.getPassword()));
        newCredential.setEncryptionKeyRef(encryptionService.getKeyReference());
        
        // Inherit configurations from old
        newCredential.setReleaseMode(oldCredential.getReleaseMode());
        newCredential.setScheduledReleaseAt(oldCredential.getScheduledReleaseAt());
        newCredential.setMatchStartMinusXMinutes(oldCredential.getMatchStartMinusXMinutes());
        newCredential.setMaxViews(oldCredential.getMaxViews());
        
        // Inherit release status
        if (oldCredential.getReleasedAt() != null) {
            newCredential.setReleasedBy(user);
            newCredential.setReleasedAt(LocalDateTime.now());
        }

        newCredential.setEntryHash(hashEntry(request.getRoomId(), request.getPassword()));
        
        newCredential = credentialRepository.save(newCredential);
        
        Map<String, Object> rotationMeta = new HashMap<>();
        rotationMeta.put("reason", request.getReason());
        rotationMeta.put("newCredentialId", newCredential.getCredentialId());
        
        // Log rotation event on old credential
        logActionWithMeta(oldCredential, user, match, CredentialLog.Action.rotated, null, null, null, rotationMeta);
        
        Map<String, Object> entryMeta = new HashMap<>();
        if (newCredential.getScheduledReleaseAt() != null) {
            entryMeta.put("scheduledReleaseAt", newCredential.getScheduledReleaseAt().toString());
        }
        entryMeta.put("releaseMode", newCredential.getReleaseMode().name());
        entryMeta.put("rotatedFrom", oldCredential.getCredentialId());
        
        // Log entry on new credential
        logActionWithMeta(newCredential, user, match, CredentialLog.Action.entered, null, null, null, entryMeta);

        // Send STOMP push notification to affected Team Captains
        List<MatchSlot> slots = matchSlotRepository.findByMatch_MatchId(match.getMatchId());
        for (MatchSlot slot : slots) {
            if (slot.getTeam() != null && slot.getTeam().getCaptain() != null) {
                User captain = slot.getTeam().getCaptain();
                
                Map<String, Object> payload = new HashMap<>();
                payload.put("type", "CREDENTIAL_ROTATED");
                payload.put("matchId", match.getMatchId());
                payload.put("message", "⚠️ Room credentials have been updated for Match " + match.getMatchNumber() + ". Check your updated Room ID and Password.");
                
                eventPublisher.sendToUserQueue(captain.getUserId(), "/queue/notifications", payload);
                
                // Simulate SMS Notification
                log.info("SMS SENT TO " + captain.getUserId() + " (Phone: " + captain.getEmail() + "): ⚠️ Room credentials have been updated for Match " + match.getMatchNumber() + ". Check your updated Room ID and Password in GameVerse.");
            }
        }

        return mapToDto(newCredential);
    }

    @org.springframework.transaction.annotation.Transactional
    public RoomCredentialDto reportLeak(String matchId, String userId, com.gameverse.modules.credential.dto.ReportLeakRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        if (!checkTournamentStaff(user, match)) {
            throw new RuntimeException("Unauthorized: Only tournament staff can report leaks");
        }

        if (match.getStatus() == Match.MatchStatus.completed) {
            throw new RuntimeException("Cannot report leak for a completed match");
        }

        List<RoomCredential> credentials = credentialRepository.findByMatch_MatchIdAndIsActiveTrue(matchId);
        if (credentials.isEmpty()) {
            throw new RuntimeException("No active credentials found to revoke");
        }
        
        RoomCredential oldCredential = credentials.get(0);

        com.gameverse.modules.credential.dto.RotateCredentialRequest rotateReq = new com.gameverse.modules.credential.dto.RotateCredentialRequest();
        rotateReq.setRoomId(request.getNewRoomId());
        rotateReq.setPassword(request.getNewPassword());
        rotateReq.setReason("Suspected Leak: " + (request.getAdditionalDetails() != null ? request.getAdditionalDetails() : "Automatic rotation via leak report"));

        // Rotate credentials which revokes old, creates new, and notifies Team Captains
        RoomCredentialDto newCredential = rotateCredential(oldCredential.getCredentialId(), userId, rotateReq);

        // Create Incident Report
        Dispute dispute = new Dispute();
        dispute.setMatch(match);
        dispute.setSubmittedBy(user);
        dispute.setCategory("Room Credential Issue");
        dispute.setDescription("Credential Leak Suspected. Credentials were automatically rotated. Details: " + (request.getAdditionalDetails() != null ? request.getAdditionalDetails() : "N/A"));
        disputeRepository.save(dispute);

        // Notify Tournament Director
        User director = match.getTournament().getCreatedBy();
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("type", "CREDENTIAL_LEAK_REPORTED");
        payload.put("matchId", match.getMatchId());
        payload.put("matchNumber", match.getMatchNumber());
        payload.put("disputeId", dispute.getDisputeId());
        payload.put("message", "🚨 Suspected credential leak reported for Match " + match.getMatchNumber() + ". Credentials have been rotated.");
        
        eventPublisher.sendToUserQueue(director.getUserId(), "/queue/notifications", payload);
        
        return newCredential;
    }
    
    private void performRelease(RoomCredential credential, User releasedBy) {
        credential.setReleasedAt(LocalDateTime.now());
        credentialRepository.save(credential);
        
        Match match = credential.getMatch();
        logAction(credential, releasedBy, match, CredentialLog.Action.released);
        
        // Notify Team Captains
        List<MatchSlot> slots = matchSlotRepository.findByMatch_MatchId(match.getMatchId());
        
        for (MatchSlot slot : slots) {
            if (slot.getTeam() != null && slot.getTeam().getCaptain() != null) {
                User captain = slot.getTeam().getCaptain();
                
                // STOMP WebSocket notification
                Map<String, Object> payload = new HashMap<>();
                payload.put("type", "CREDENTIAL_RELEASED");
                payload.put("matchId", match.getMatchId());
                payload.put("message", "Room credentials for Match " + match.getMatchNumber() + " have been released.");
                
                eventPublisher.sendToUserQueue(captain.getUserId(), "/queue/notifications", payload);
                
                // Simulate SMS Notification
                log.info("SMS SENT TO " + captain.getUserId() + " (Phone: " + captain.getEmail() + "): Room credentials for Match " + match.getMatchNumber() + " are now available in your GameVerse dashboard.");
            }
        }
    }
    
    private boolean checkTournamentStaff(User user, Match match) {
        // Simplified check: In actual implementation, check Org/Tournament roles
        // For now, if they are the referee or if they have ADMIN roles, return true
        if (match.getAssignedReferee() != null && match.getAssignedReferee().getUserId().equals(user.getUserId())) {
            return true;
        }
        return user.getPlatformRole() != null && (user.getPlatformRole().name().equals("super_admin"));
    }

    private void logAction(RoomCredential credential, User user, Match match, CredentialLog.Action action) {
        logActionWithMeta(credential, user, match, action, null, null, null, null);
    }

    private void logActionWithMeta(RoomCredential credential, User user, Match match, CredentialLog.Action action, String ipAddress, String userAgent, String deviceId, java.util.Map<String, Object> metadata) {
        CredentialLog log = new CredentialLog();
        log.setCredential(credential);
        log.setUser(user);
        log.setMatch(match);
        log.setAction(action);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setDeviceId(deviceId);
        log.setMetadata(metadata);
        logRepository.save(log);
    }

    private String hashEntry(String roomId, String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((roomId + ":" + password).getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing entry", e);
        }
    }

    private RoomCredentialDto mapToDto(RoomCredential c) {
        return RoomCredentialDto.builder()
                .credentialId(c.getCredentialId())
                .matchId(c.getMatch().getMatchId())
                .enteredByUserId(c.getEnteredBy().getUserId())
                .releaseMode(c.getReleaseMode())
                .scheduledReleaseAt(c.getScheduledReleaseAt())
                .matchStartMinusXMinutes(c.getMatchStartMinusXMinutes())
                .releasedAt(c.getReleasedAt())
                .expiresAt(c.getExpiresAt())
                .isActive(c.getIsActive())
                .isRevoked(c.getIsRevoked())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
