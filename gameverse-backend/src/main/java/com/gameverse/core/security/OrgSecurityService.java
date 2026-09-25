package com.gameverse.core.security;

import com.gameverse.modules.organization.entity.OrgMember;
import com.gameverse.modules.organization.repository.OrgMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("orgSecurity")
@RequiredArgsConstructor
public class OrgSecurityService {

    private final OrgMemberRepository orgMemberRepository;

    public boolean hasRole(String orgId, String... allowedRoles) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return false;
        }
        
        String userId = auth.getName();
        
        Optional<OrgMember> memberOpt = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, userId);
        if (memberOpt.isEmpty()) {
            return false;
        }
        
        OrgMember.OrgRole userRole = memberOpt.get().getRole();
        
        for (String role : allowedRoles) {
            if (userRole.name().equals(role)) {
                return true;
            }
        }
        
        return false;
    }
    
    public boolean hasAnyRole(String orgId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return false;
        }
        String userId = auth.getName();
        return orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, userId).isPresent();
    }
    
    public int getRoleLevel(OrgMember.OrgRole role) {
        if (role == null) return 0;
        switch (role) {
            case org_owner: return 4;
            case org_admin: return 3;
            case tournament_director: return 2;
            case referee: 
            case broadcast_producer: return 1;
            default: return 0;
        }
    }
    
    public boolean isRoleHigher(OrgMember.OrgRole requesterRole, OrgMember.OrgRole targetRole) {
        return getRoleLevel(requesterRole) > getRoleLevel(targetRole);
    }
    
    public boolean isRoleHigherOrEqual(OrgMember.OrgRole requesterRole, OrgMember.OrgRole targetRole) {
        return getRoleLevel(requesterRole) >= getRoleLevel(targetRole);
    }
}
