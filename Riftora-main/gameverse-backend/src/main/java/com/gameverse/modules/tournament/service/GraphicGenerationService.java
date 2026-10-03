package com.gameverse.modules.tournament.service;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class GraphicGenerationService {

    private static final Logger logger = LoggerFactory.getLogger(GraphicGenerationService.class);

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.storage.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${app.backend.url:http://localhost:8081}")
    private String backendUrl;

    /**
     * Generates a graphic by taking a screenshot of a hidden frontend route using Playwright.
     * 
     * @param type The type of graphic (e.g., "match-result", "leaderboard")
     * @param targetId The ID of the match or tournament to render
     * @param includeWatermark Whether to include the GameVerse watermark
     * @return The filename of the generated graphic
     */
    public String generateGraphic(String tournamentId, String type, String targetId, boolean includeWatermark) {
        String filename = "graphic_" + type + "_" + targetId + "_" + UUID.randomUUID().toString().substring(0, 8) + ".png";
        Path outputPath = Paths.get(uploadDir, "graphics", filename);

        try {
            Files.createDirectories(outputPath.getParent());
            
            // Build the URL to render
            String targetUrl = String.format("%s/render/graphic/%s/%s/%s?watermark=%b", 
                    frontendUrl, type, tournamentId, targetId, includeWatermark);
                    
            logger.info("Generating graphic via Playwright at URL: {}", targetUrl);

            // Launch Playwright and Chromium
            try (Playwright playwright = Playwright.create()) {
                Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
                Page page = browser.newPage();
                
                // Navigate to the React app route and wait until network is idle
                page.navigate(targetUrl, new Page.NavigateOptions().setWaitUntil(com.microsoft.playwright.options.WaitUntilState.NETWORKIDLE));
                
                // Give it a brief delay to ensure fonts/animations are settled
                page.waitForTimeout(1000);
                
                // We assume the React component will have an element with ID "graphic-container" which we screenshot
                page.locator("#graphic-container").screenshot(new com.microsoft.playwright.Locator.ScreenshotOptions().setPath(outputPath));
                
                browser.close();
            }
            
            logger.info("Graphic generated successfully: {}", outputPath);
            return backendUrl + "/uploads/graphics/" + filename;
            
        } catch (Exception e) {
            logger.error("Failed to generate graphic", e);
            throw new RuntimeException("Failed to generate graphic", e);
        }
    }
}
