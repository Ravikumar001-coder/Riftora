package com.gameverse.modules.credential.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CredentialScheduler {

    private final CredentialService credentialService;

    @Scheduled(fixedRate = 60000) // Run every minute
    public void processAutoLocking() {
        credentialService.processAutoLocking();
    }
}
