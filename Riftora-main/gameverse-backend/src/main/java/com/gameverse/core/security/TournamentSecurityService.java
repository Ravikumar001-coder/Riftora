package com.gameverse.core.security;

import com.gameverse.modules.organization.entity.OrgMember;
import com.gameverse.modules.organization.repository.OrgMemberRepository;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import com.gameverse.modules.tournament.entity.TournamentStaff;
import com.gameverse.modules.tournament.repository.TournamentStaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("tournamentSecurity")
@RequiredArgsConstructor
public class TournamentSecurityService {

    private final TournamentStaffRepository tournamentStaffRepository;
    private final TournamentRepository tournamentRepository;
    private final OrgSecurityService orgSecurity;

    public boolean hasRole(String tournamentId, String... allowedRoles) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return false;
        }

        String userId = auth.getName();

        // Check if user is staff on the tournament directly
        Optional<TournamentStaff> staffOpt = tournamentStaffRepository.findByTournament_TournamentIdAndUser_UserId(tournamentId, userId);
        if (staffOpt.isPresent()) {
            TournamentStaff.StaffRole staffRole = staffOpt.get().getStaffRole();
            for (String role : allowedRoles) {
                if (staffRole.name().equals(role)) {
                    return true;
                }
            }
        }

        // Fallback: check if user has high-level org role
        Optional<Tournament> tournamentOpt = tournamentRepository.findById(tournamentId);
        if (tournamentOpt.isPresent()) {
            String orgId = tournamentOpt.get().getOrganization().getOrgId();
            // Allow org_owner or org_admin to manage tournament
            if (orgSecurity.hasRole(orgId, "org_owner", "org_admin")) {
                // If they need specific staff role, but are org owner/admin, we grant it automatically
                return true;
            }
        }

        return false;
    }

    // Future expansion for Match security could go here
}
