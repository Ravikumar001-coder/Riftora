package com.gameverse.modules.auth.service;


import com.gameverse.core.storage.FileStorageService;
import com.gameverse.modules.auth.dto.PublicProfileDto;
import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    @Autowired
    public UserProfileService(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public String uploadAvatar(String userId, MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Unsupported file format. Please upload JPG, PNG, or WebP.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 2MB limit.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Generate a new unique file name
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        // Force webp if we wanted, but let's just keep the original extension or jpg
        if (extension.isEmpty()) {
            extension = ".jpg";
        }

        String newFileName = UUID.randomUUID().toString() + extension;

        // Resize and crop to 400x400
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        Thumbnails.of(file.getInputStream())
                .size(400, 400)
                .crop(net.coobird.thumbnailator.geometry.Positions.CENTER)
                .keepAspectRatio(true)
                .outputQuality(0.90)
                .toOutputStream(os);

        InputStream is = new ByteArrayInputStream(os.toByteArray());

        // Save file
        String avatarUrl = fileStorageService.storeFile(is, "avatars", newFileName);

        // Update user entity
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        return avatarUrl;
    }

    @Transactional(readOnly = true)
    public PublicProfileDto getPublicProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal());
        String currentUserId = isAuthenticated ? (String) auth.getPrincipal() : null;

        if (user.getProfileVisibility() == User.ProfileVisibility.private_view) {
            if (!user.getUserId().equals(currentUserId)) {
                throw new AccessDeniedException("This profile is private.");
            }
        } else if (user.getProfileVisibility() == User.ProfileVisibility.platform) {
            if (!isAuthenticated) {
                throw new AccessDeniedException("This profile is only visible to registered users.");
            }
        }

        return PublicProfileDto.builder()
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .country(user.getCountry())
                .profileVisibility(user.getProfileVisibility() != null ? user.getProfileVisibility().name() : null)
                .createdAt(user.getCreatedAt())
                .lastActiveAt(user.getLastLoginAt())
                .stats(Map.of(
                        "totalTournaments", 0,
                        "activeEvents", 0,
                        "matchesPlayed", 0,
                        "bestPlacement", "Unranked"
                ))
                .socials(Map.of())
                .supportedGames(List.of())
                .build();
    }
}
