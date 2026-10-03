package com.gameverse.modules.auth.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.auth.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/v1/users/me")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Autowired
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping("/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            @RequestParam("avatar") MultipartFile avatar,
            Authentication authentication
    ) {
        try {
            String userId = (String) authentication.getPrincipal();
            
            String avatarUrl = userProfileService.uploadAvatar(userId, avatar);
            
            return ResponseEntity.ok(ApiResponse.success(Map.of(
                    "message", "Avatar uploaded successfully",
                    "avatarUrl", avatarUrl
            )));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("INTERNAL_ERROR", "Failed to upload avatar: " + e.getMessage()));
        }
    }
}
