package com.gameverse.modules.organization.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.organization.dto.CreateOrgRequest;
import com.gameverse.modules.organization.dto.UpdateOrgSettingsRequest;
import com.gameverse.modules.organization.dto.OrgResponse;
import com.gameverse.modules.organization.service.OrgService;
import com.gameverse.modules.organization.service.OrgPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/organizations")
@RequiredArgsConstructor
public class OrgController {

    private final OrgService orgService;
    private final com.gameverse.modules.organization.service.OrgMemberService orgMemberService;
    private final OrgPlanService orgPlanService;
    private final com.gameverse.modules.organization.service.OrgInvitationService orgInvitationService;
    private final com.gameverse.modules.organization.service.BrandKitImageService brandKitImageService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrgResponse>> createOrganization(
            @Valid @RequestBody CreateOrgRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        OrgResponse response = orgService.createOrganization(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrgResponse>>> getOrganizations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        Page<OrgResponse> orgPage = orgService.getUserOrganizations(userId, PageRequest.of(page, limit));
        
        return ResponseEntity.ok(ApiResponse.success(
                orgPage.getContent(),
                Map.of(
                        "pagination", Map.of(
                                "page", orgPage.getNumber(),
                                "limit", orgPage.getSize(),
                                "total", orgPage.getTotalElements(),
                                "total_pages", orgPage.getTotalPages()
                        )
                )
        ));
    }

    @GetMapping("/{orgId}")
    public ResponseEntity<ApiResponse<OrgResponse>> getOrganization(@PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(orgService.getOrganization(orgId)));
    }

    @GetMapping("/by-slug/{orgSlug}")
    public ResponseEntity<ApiResponse<OrgResponse>> getOrganizationBySlug(@PathVariable String orgSlug) {
        return ResponseEntity.ok(ApiResponse.success(orgService.getOrganizationBySlug(orgSlug)));
    }

    @GetMapping("/check-slug")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkSlugAvailability(@RequestParam String slug) {
        boolean exists = orgService.checkSlugExists(slug);
        return ResponseEntity.ok(ApiResponse.success(Map.of("available", !exists)));
    }

    @GetMapping("/by-subdomain/{customSubdomain}")
    public ResponseEntity<ApiResponse<OrgResponse>> getOrganizationByCustomSubdomain(@PathVariable String customSubdomain) {
        return ResponseEntity.ok(ApiResponse.success(orgService.getOrganizationByCustomSubdomain(customSubdomain)));
    }

    @GetMapping("/{orgId}/dashboard-stats")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner', 'org_admin')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.organization.dto.dashboard.DashboardDataDto>> getDashboardStats(@PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(orgService.getDashboardStats(orgId)));
    }

    @PutMapping("/{orgId}/settings")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner', 'org_admin')")
    public ResponseEntity<ApiResponse<OrgResponse>> updateOrganizationSettings(
            @PathVariable String orgId,
            @Valid @RequestBody UpdateOrgSettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.success(orgService.updateOrganizationSettings(orgId, request)));
    }

    @PutMapping("/{orgId}/brand-kit")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner', 'org_admin')")
    public ResponseEntity<ApiResponse<OrgResponse>> updateBrandKit(
            @PathVariable String orgId,
            @Valid @RequestBody com.gameverse.modules.organization.dto.OrganizationBrandKitDto request) {
        return ResponseEntity.ok(ApiResponse.success(orgService.updateBrandKit(orgId, request)));
    }

    @PostMapping("/{orgId}/brand-kit/logos")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner', 'org_admin')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadLogo(
            @PathVariable String orgId,
            @RequestParam("type") String type,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            String url = brandKitImageService.uploadAndProcessLogo(orgId, type, file);
            return ResponseEntity.ok(ApiResponse.success(Map.of("url", url)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("INVALID_FILE", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("UPLOAD_FAILED", "Failed to upload logo: " + e.getMessage()));
        }
    }

    @GetMapping("/{orgId}/members")
    public ResponseEntity<ApiResponse<List<com.gameverse.modules.organization.dto.OrgMemberResponse>>> getMembers(
            @PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(orgMemberService.getOrganizationMembers(orgId)));
    }

    @PutMapping("/{orgId}/members/{userId}/role")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner', 'org_admin')")
    public ResponseEntity<ApiResponse<Void>> updateMemberRole(
            @PathVariable String orgId,
            @PathVariable String userId,
            @RequestBody Map<String, String> body) {
        
        com.gameverse.modules.organization.entity.OrgMember.OrgRole newRole = 
            com.gameverse.modules.organization.entity.OrgMember.OrgRole.valueOf(body.get("role"));
        
        String customRoleName = body.get("customRoleName");
            
        orgMemberService.updateMemberRole(orgId, userId, newRole, customRoleName);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/{orgId}/audit/role-changes")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner', 'org_admin')")
    public ResponseEntity<ApiResponse<List<com.gameverse.modules.organization.dto.OrgAuditLogResponse>>> getRoleAuditLogs(
            @PathVariable String orgId) {
        
        List<com.gameverse.modules.organization.dto.OrgAuditLogResponse> logs = orgMemberService.getAuditLogs(orgId);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @DeleteMapping("/{orgId}/members/{userId}")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner', 'org_admin') or principal == #userId")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable String orgId,
            @PathVariable String userId) {
        
        orgMemberService.removeMember(orgId, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{orgId}/invites")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner', 'org_admin')")
    public ResponseEntity<ApiResponse<Map<String, String>>> inviteUser(
            @PathVariable String orgId,
            @Valid @RequestBody com.gameverse.modules.organization.dto.OrgInviteRequest request) {
        
        com.gameverse.modules.organization.entity.OrgInvitation invite;
        if (request.getEmail() != null) {
            invite = orgInvitationService.inviteByEmail(orgId, request.getEmail(), request.getRole());
        } else if (request.getUsername() != null) {
            invite = orgInvitationService.inviteByUsername(orgId, request.getUsername(), request.getRole());
        } else {
            throw new IllegalArgumentException("Either email or username must be provided");
        }
        
        return ResponseEntity.ok(ApiResponse.success(Map.of("token", invite.getToken())));
    }

    @PostMapping("/{orgId}/join-links")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner', 'org_admin')")
    public ResponseEntity<ApiResponse<Map<String, String>>> createJoinLink(
            @PathVariable String orgId,
            @Valid @RequestBody com.gameverse.modules.organization.dto.OrgJoinLinkRequest request) {
        
        com.gameverse.modules.organization.entity.OrgJoinLink link = 
                orgInvitationService.createJoinLink(orgId, request.getRole(), request.getMaxUses(), request.getExpiryDays());
                
        return ResponseEntity.ok(ApiResponse.success(Map.of("token", link.getToken())));
    }

    @PostMapping("/join/accept-invite/{token}")
    public ResponseEntity<ApiResponse<Void>> acceptInvite(@PathVariable String token) {
        orgInvitationService.acceptInvitation(token);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/join/accept-link/{token}")
    public ResponseEntity<ApiResponse<Void>> acceptJoinLink(@PathVariable String token) {
        orgInvitationService.acceptJoinLink(token);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{orgId}/ownership/transfer")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner')")
    public ResponseEntity<ApiResponse<Void>> initiateOwnershipTransfer(
            @PathVariable String orgId,
            @RequestBody Map<String, String> body) {
        
        String toUserId = body.get("toUserId");
        if (toUserId == null) {
            throw new IllegalArgumentException("toUserId must be provided");
        }
        
        orgMemberService.initiateOwnershipTransfer(orgId, toUserId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{orgId}/ownership/transfer/{transferId}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptOwnershipTransfer(
            @PathVariable String orgId,
            @PathVariable String transferId) {
        
        orgMemberService.acceptOwnershipTransfer(orgId, transferId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{orgId}/ownership/transfer/{transferId}/cancel")
    @org.springframework.security.access.prepost.PreAuthorize("@orgSecurity.hasRole(#orgId, 'org_owner')")
    public ResponseEntity<ApiResponse<Void>> cancelOwnershipTransfer(
            @PathVariable String orgId,
            @PathVariable String transferId) {
        
        orgMemberService.cancelOwnershipTransfer(orgId, transferId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/{orgId}/members/leave")
    public ResponseEntity<ApiResponse<Void>> leaveOrganization(@PathVariable String orgId) {
        orgMemberService.leaveOrganization(orgId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PreAuthorize("hasPermission(#orgId, 'Organization', 'org_admin')")
    @PostMapping("/{orgId}/plans/change")
    public ResponseEntity<ApiResponse<Void>> changePlan(@PathVariable String orgId, @RequestBody java.util.Map<String, String> request) {
        String newPlanCode = request.get("planCode");
        if (newPlanCode == null) throw new IllegalArgumentException("planCode is required");
        orgPlanService.changePlan(orgId, newPlanCode);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
