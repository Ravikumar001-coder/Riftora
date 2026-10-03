package com.gameverse.modules.tournament.controller;

import com.gameverse.modules.tournament.dto.TournamentStaffDto;
import com.gameverse.modules.tournament.entity.TournamentStaff;
import com.gameverse.modules.tournament.repository.TournamentStaffRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import com.gameverse.modules.audit.repository.AuditLogRepository;
import com.gameverse.modules.audit.entity.AuditLog;
import com.gameverse.modules.tournament.dto.StaffActivityLogDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/tournaments/{tournamentId}/staff")
@RequiredArgsConstructor
public class TournamentStaffController {

    private final TournamentStaffRepository staffRepository;
    private final TournamentRepository tournamentRepository;
    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TournamentStaffDto>> getTournamentStaff(@PathVariable String tournamentId) {
        List<TournamentStaff> staffList = staffRepository.findByTournament_TournamentId(tournamentId);
        
        List<TournamentStaffDto> dtos = staffList.stream().map(s -> {
            TournamentStaffDto dto = new TournamentStaffDto();
            dto.setStaffId(s.getStaffId());
            dto.setTournamentId(s.getTournament().getTournamentId());
            dto.setUserId(s.getUser().getUserId());
            dto.setUsername(s.getUser().getUsername());
            dto.setEmail(s.getUser().getEmail());
            dto.setAvatar(s.getUser().getUsername() != null && !s.getUser().getUsername().isEmpty() ? s.getUser().getUsername().substring(0, 1).toUpperCase() : "?");
            dto.setStaffRole(s.getStaffRole().name());
            dto.setIsActive(s.getIsActive());
            dto.setAssignedAt(s.getAssignedAt());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin')")
    @Transactional
    public ResponseEntity<TournamentStaffDto> assignStaff(
            @PathVariable String tournamentId,
            @RequestBody TournamentStaffDto request) {
            
        var tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
                
        var user = new com.gameverse.modules.auth.entity.User();
        user.setUserId(request.getUserId());

        var role = TournamentStaff.StaffRole.valueOf(request.getStaffRole());

        // Check if already assigned
        var existing = staffRepository.findByTournament_TournamentIdAndUser_UserIdAndStaffRole(
                tournamentId, request.getUserId(), role);
                
        TournamentStaff staff;
        if (existing.isPresent()) {
            staff = existing.get();
            staff.setIsActive(true);
        } else {
            staff = new TournamentStaff();
            staff.setTournament(tournament);
            staff.setUser(user);
            staff.setStaffRole(role);
        }
        
        staff = staffRepository.save(staff);
        
        TournamentStaffDto dto = new TournamentStaffDto();
        dto.setStaffId(staff.getStaffId());
        dto.setTournamentId(staff.getTournament().getTournamentId());
        dto.setUserId(staff.getUser().getUserId());
        dto.setStaffRole(staff.getStaffRole().name());
        dto.setIsActive(staff.getIsActive());
        dto.setAssignedAt(staff.getAssignedAt());
        
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{staffId}")
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin')")
    @Transactional
    public ResponseEntity<Void> removeStaff(
            @PathVariable String tournamentId,
            @PathVariable String staffId) {
            
        staffRepository.findById(staffId).ifPresent(staff -> {
            // soft delete or hard delete? The schema suggests we could set isActive = false, but delete is simpler
            staffRepository.delete(staff);
        });
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{staffId}/logs")
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin') or principal == #staffId")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<StaffActivityLogDto>> getStaffLogs(
            @PathVariable String tournamentId,
            @PathVariable String staffId,
            Pageable pageable) {

        // Note: staffId from path is the userId because the frontend passes staff.userId
        Page<AuditLog> logs = auditLogRepository.findByTournament_TournamentIdAndActor_UserIdOrderByCreatedAtDesc(tournamentId, staffId, pageable);

        Page<StaffActivityLogDto> dtos = logs.map(log -> {
            StaffActivityLogDto dto = new StaffActivityLogDto();
            dto.setLogId(log.getLogId());
            dto.setEntityType(log.getEntityType());
            dto.setActionCode(log.getActionCode());
            dto.setActionDetails(log.getActionDetails());
            dto.setMatchId(log.getMatch() != null ? log.getMatch().getMatchId() : null);
            dto.setCreatedAt(log.getCreatedAt());
            return dto;
        });

        return ResponseEntity.ok(dtos);
    }
}
