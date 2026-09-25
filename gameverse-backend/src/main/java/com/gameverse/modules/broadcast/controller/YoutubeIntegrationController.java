package com.gameverse.modules.broadcast.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.broadcast.dto.ConnectYoutubeRequest;
import com.gameverse.modules.broadcast.dto.YoutubeIntegrationDto;
import com.gameverse.modules.broadcast.service.YoutubeIntegrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/organizations/{orgId}/broadcast/youtube")
@RequiredArgsConstructor
public class YoutubeIntegrationController {

    private final YoutubeIntegrationService youtubeIntegrationService;

    @GetMapping
    public ResponseEntity<ApiResponse<YoutubeIntegrationDto>> getIntegration(
            @PathVariable String orgId) {
        
        YoutubeIntegrationDto response = youtubeIntegrationService.getIntegration(orgId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/connect")
    public ResponseEntity<ApiResponse<YoutubeIntegrationDto>> connectYoutube(
            @PathVariable String orgId,
            @Valid @RequestBody ConnectYoutubeRequest request) {
        
        YoutubeIntegrationDto response = youtubeIntegrationService.connectYoutube(orgId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @DeleteMapping("/disconnect")
    public ResponseEntity<ApiResponse<Void>> disconnectYoutube(
            @PathVariable String orgId) {
        
        youtubeIntegrationService.disconnectYoutube(orgId);
        
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
