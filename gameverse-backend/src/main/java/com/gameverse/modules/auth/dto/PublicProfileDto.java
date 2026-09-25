package com.gameverse.modules.auth.dto;

import com.gameverse.modules.game.dto.PublicLinkedAccountDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicProfileDto {
    private String username;
    private String displayName;
    private String avatarUrl;
    private String bio;
    private String country;
    private String profileVisibility;
    private LocalDateTime createdAt;
    private LocalDateTime lastActiveAt;
    
    private Map<String, Object> stats;
    private Map<String, String> socials;
    private List<String> supportedGames;
    
    private List<PublicLinkedAccountDto> gameAccounts;
}
