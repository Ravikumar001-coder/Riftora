package com.gameverse.modules.finance.service;

import com.gameverse.modules.finance.dto.PayoutMethodDto;
import com.gameverse.modules.finance.entity.OrgPayoutMethod;
import com.gameverse.modules.finance.entity.TeamPayoutMethod;
import com.gameverse.modules.finance.repository.OrgPayoutMethodRepository;
import com.gameverse.modules.finance.repository.TeamPayoutMethodRepository;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import com.gameverse.modules.team.entity.Team;
import com.gameverse.modules.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayoutMethodService {
    private final TeamPayoutMethodRepository teamPayoutMethodRepository;
    private final OrgPayoutMethodRepository orgPayoutMethodRepository;
    private final TeamRepository teamRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional
    public PayoutMethodDto addTeamPayoutMethod(String teamId, PayoutMethodDto dto) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        TeamPayoutMethod method = new TeamPayoutMethod();
        method.setTeam(team);
        method.setMethodType(dto.getMethodType());
        method.setAccountDetails(dto.getAccountDetails());

        if ("upi".equalsIgnoreCase(dto.getMethodType())) {
            // FR-16-008: UPI must be validated via /upi/validate before it is fully verified
            method.setVpaValidationStatus("pending");
            method.setIsVerified(false); // Not verified until VPA validation passes
        } else {
            // Bank account — manual verification, mark VPA as skipped
            method.setVpaValidationStatus("skipped");
            method.setIsVerified(true);
            method.setVerifiedAt(java.time.LocalDateTime.now());
        }

        teamPayoutMethodRepository.save(method);
        return mapTeamMethod(method);
    }

    @Transactional(readOnly = true)
    public List<PayoutMethodDto> getTeamPayoutMethods(String teamId) {
        return teamPayoutMethodRepository.findByTeamTeamId(teamId).stream()
                .map(this::mapTeamMethod)
                .collect(Collectors.toList());
    }

    @Transactional
    public PayoutMethodDto addOrgPayoutMethod(String orgId, PayoutMethodDto dto) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        OrgPayoutMethod method = new OrgPayoutMethod();
        method.setOrganization(org);
        method.setMethodType(dto.getMethodType());
        method.setAccountDetails(dto.getAccountDetails());
        method.setIsVerified(true);
        method.setVerifiedAt(LocalDateTime.now());
        method.setKycStatus("pending");
        
        orgPayoutMethodRepository.save(method);
        return mapOrgMethod(method);
    }

    @Transactional(readOnly = true)
    public List<PayoutMethodDto> getOrgPayoutMethods(String orgId) {
        return orgPayoutMethodRepository.findByOrganizationOrgId(orgId).stream()
                .map(this::mapOrgMethod)
                .collect(Collectors.toList());
    }

    private PayoutMethodDto mapTeamMethod(TeamPayoutMethod method) {
        PayoutMethodDto dto = new PayoutMethodDto();
        dto.setMethodId(method.getMethodId());
        dto.setEntityId(method.getTeam().getTeamId());
        dto.setMethodType(method.getMethodType());
        dto.setAccountDetails(method.getAccountDetails());
        dto.setIsVerified(method.getIsVerified());
        dto.setVerifiedAt(method.getVerifiedAt());
        dto.setVpaValidationStatus(method.getVpaValidationStatus());
        dto.setVpaValidatedAt(method.getVpaValidatedAt());
        dto.setVpaName(method.getVpaName());
        return dto;
    }

    private PayoutMethodDto mapOrgMethod(OrgPayoutMethod method) {
        PayoutMethodDto dto = new PayoutMethodDto();
        dto.setMethodId(method.getMethodId());
        dto.setEntityId(method.getOrganization().getOrgId());
        dto.setMethodType(method.getMethodType());
        dto.setAccountDetails(method.getAccountDetails());
        dto.setIsVerified(method.getIsVerified());
        dto.setVerifiedAt(method.getVerifiedAt());
        dto.setKycStatus(method.getKycStatus());
        return dto;
    }
}
