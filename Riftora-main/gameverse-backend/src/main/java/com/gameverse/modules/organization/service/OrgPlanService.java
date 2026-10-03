package com.gameverse.modules.organization.service;

import com.gameverse.modules.organization.entity.OrgPlan;
import com.gameverse.modules.organization.repository.OrgPlanRepository;
import com.gameverse.core.notification.service.EmailNotificationService;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrgPlanService {

    private final OrgPlanRepository orgPlanRepository;
    private final OrganizationRepository organizationRepository;
    private final EmailNotificationService emailNotificationService;

    @Transactional(readOnly = true)
    public List<OrgPlan> getAllPlans() {
        return orgPlanRepository.findAll();
    }

    @Transactional
    public void changePlan(String orgId, String newPlanCode) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        OrgPlan newPlan = orgPlanRepository.findByPlanCode(OrgPlan.PlanCode.valueOf(newPlanCode.toUpperCase()))
                .orElseThrow(() -> new RuntimeException("Invalid plan code"));

        if (org.getPlan().getPlanCode().name().equalsIgnoreCase(newPlanCode)) {
            throw new RuntimeException("Organization is already on this plan");
        }

        boolean isDowngrade = newPlan.getPriceMonthly().compareTo(org.getPlan().getPriceMonthly()) < 0;

        if (isDowngrade) {
            org.setNextPlan(newPlan);
            if (org.getCurrentPeriodEnd() == null) {
                org.setCurrentPeriodEnd(LocalDateTime.now().plusDays(30)); // Mocking end of billing cycle
            }
        } else {
            org.setPlan(newPlan);
            org.setNextPlan(null);
            org.setCurrentPeriodEnd(LocalDateTime.now().plusDays(30)); // Reset billing cycle for upgrade
        }

        organizationRepository.save(org);
        emailNotificationService.sendPlanChangeConfirmation(org, newPlan.getPlanName(), isDowngrade);
    }
}
