package com.gameverse.core.notification.service;

import com.gameverse.modules.organization.entity.Organization;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailNotificationService {

    public void sendPlanLimitWarning(Organization org, String limitType, int current, int max) {
        log.info("📧 [EMAIL MOCK] To: {} | Subject: Warning: Approaching {} Limit", org.getContactEmail(), limitType);
        log.info("Body: Your organization '{}' has reached {} of its {} allowed {}.", org.getOrgName(), current, max, limitType);
    }

    public void sendPlanLimitReached(Organization org, String limitType, int max) {
        log.info("📧 [EMAIL MOCK] To: {} | Subject: ACTION REQUIRED: {} Limit Reached", org.getContactEmail(), limitType);
        log.info("Body: Your organization '{}' has reached its maximum limit of {} {}. Please upgrade your plan to continue.", org.getOrgName(), max, limitType);
    }

    public void sendPlanChangeConfirmation(Organization org, String planName, boolean isDowngrade) {
        String action = isDowngrade ? "Downgrade Scheduled" : "Upgrade Successful";
        log.info("📧 [EMAIL MOCK] To: {} | Subject: {}", org.getContactEmail(), action);
        if (isDowngrade) {
            log.info("Body: Your plan has been scheduled to downgrade to {} at the end of your billing cycle.", planName);
        } else {
            log.info("Body: Your plan has been successfully upgraded to {}.", planName);
        }
    }
}
