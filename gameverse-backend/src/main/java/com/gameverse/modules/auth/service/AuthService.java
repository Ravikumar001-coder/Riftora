package com.gameverse.modules.auth.service;

import com.gameverse.core.exception.OAuthLinkRequiredException;
import com.gameverse.core.security.JwtService;
import com.gameverse.modules.auth.dto.*;
import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.entity.UserSession;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.auth.repository.UserSessionRepository;
import com.gameverse.modules.auth.entity.OauthProvider;
import com.gameverse.modules.auth.entity.OtpVerification;
import com.gameverse.modules.auth.entity.EmailVerification;
import com.gameverse.modules.auth.repository.OauthProviderRepository;
import com.gameverse.modules.auth.repository.OtpVerificationRepository;
import com.gameverse.modules.auth.repository.EmailVerificationRepository;
import com.gameverse.modules.auth.repository.DisposableEmailDomainRepository;
import com.gameverse.modules.auth.entity.LoginHistory;
import com.gameverse.modules.auth.repository.LoginHistoryRepository;
import com.gameverse.modules.organization.repository.OrgMemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.Random;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpVerificationRepository otpVerificationRepository;
    private final OauthProviderRepository oauthProviderRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final DisposableEmailDomainRepository disposableEmailDomainRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final OrgMemberRepository orgMemberRepository;

    @Transactional
    public void registerWithEmail(EmailRegisterRequest request) {
        String emailDomain = request.getEmail().substring(request.getEmail().lastIndexOf("@") + 1).toLowerCase();
        if (disposableEmailDomainRepository.existsByDomainIgnoreCase(emailDomain)) {
            throw new RuntimeException("Disposable or temporary email domains are not allowed");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        // Generate a default display name and username if needed, or require in request
        user.setUsername(request.getEmail().split("@")[0] + "_" + System.currentTimeMillis() % 1000);
        user.setDisplayName(request.getEmail().split("@")[0]);
        user.setOnboardingCompleted(false);

        User savedUser = userRepository.save(user);

        EmailVerification verification = new EmailVerification();
        verification.setUserId(savedUser.getUserId());
        verification.setEmail(savedUser.getEmail());
        verification.setExpiresAt(LocalDateTime.now().plusHours(24));
        EmailVerification savedVerification = emailVerificationRepository.save(verification);

        log.info("====== DEVELOPMENT MOCK EMAIL GATEWAY ======");
        log.info("Verification Link: http://localhost:5173/auth/verify-email?token={}", savedVerification.getToken());
        log.info("==========================================");
    }

    @Transactional
    public AuthResponse loginWithEmail(EmailLoginRequest request, String ipAddress, String userAgent) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            logLoginEvent(null, request.getEmail(), LoginHistory.LoginMethod.EMAIL, ipAddress, userAgent, false, "Invalid credentials");
            throw new RuntimeException("Invalid credentials");
        }
        User user = userOpt.get();

        checkAccountLock(user);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            handleFailedLogin(user, request.getEmail(), LoginHistory.LoginMethod.EMAIL, ipAddress, userAgent);
            throw new RuntimeException("Invalid credentials");
        }

        if (Boolean.TRUE.equals(user.getIsSuspended())) {
            logLoginEvent(user.getUserId(), request.getEmail(), LoginHistory.LoginMethod.EMAIL, ipAddress, userAgent, false, "Account is suspended");
            throw new RuntimeException("Account is suspended");
        }

        if (Boolean.TRUE.equals(user.getIsTotpEnabled())) {
            // Return temp token for 2FA
            String tempToken = jwtService.generateToken(user.getUserId(), user.getUsername());
            return AuthResponse.builder()
                    .requires2fa(true)
                    .tempToken(tempToken)
                    .build();
        }

        resetFailedLogins(user);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        logLoginEvent(user.getUserId(), request.getEmail(), LoginHistory.LoginMethod.EMAIL, ipAddress, userAgent, true, null);

        return buildAuthResponse(user, ipAddress, userAgent);
    }

    @Transactional
    public AuthResponse verifyTotpAndLogin(String tempToken, String code, String ipAddress, String userAgent, TotpService totpService) {
        String userId = jwtService.extractUserId(tempToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        checkAccountLock(user);

        if (!totpService.verify(user.getTotpSecret(), code)) {
            handleFailedLogin(user, user.getEmail(), LoginHistory.LoginMethod.EMAIL, ipAddress, userAgent);
            throw new RuntimeException("Invalid 2FA code");
        }

        resetFailedLogins(user);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        logLoginEvent(user.getUserId(), user.getEmail(), LoginHistory.LoginMethod.EMAIL, ipAddress, userAgent, true, null);

        return buildAuthResponse(user, ipAddress, userAgent);
    }

    @Transactional(readOnly = true)
    public UserDto getMe(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .platformRole(user.getPlatformRole().name())
                .onboardingCompleted(user.getOnboardingCompleted())
                .onboardingPath(user.getOnboardingPath() != null ? user.getOnboardingPath().name() : null)
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.getIsActive())
                .bio(user.getBio())
                .country(user.getCountry())
                .profileVisibility(user.getProfileVisibility() != null ? user.getProfileVisibility().name() : null)
                .orgRoles(
                    orgMemberRepository.findByUser_UserId(user.getUserId()).stream()
                        .map(member -> UserOrgRoleDto.builder()
                                .orgId(member.getOrganization().getOrgId())
                                .orgName(member.getOrganization().getOrgName())
                                .orgRole(member.getRole().name())
                                .build())
                        .toList()
                )
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
    
    @Transactional(readOnly = true)
    public boolean isUsernameTaken(String username) {
        if (username == null || !username.matches("^[a-zA-Z0-9_]{3,20}$")) {
            return true; // invalid username format is considered taken
        }
        return userRepository.existsByUsernameIgnoreCase(username);
    }

    @Transactional
    public UserDto updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getUsername() != null && !request.getUsername().equalsIgnoreCase(user.getUsername())) {
            if (isUsernameTaken(request.getUsername())) {
                throw new RuntimeException("Username is already taken");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }

        if (request.getProfileVisibility() != null) {
            try {
                user.setProfileVisibility(User.ProfileVisibility.valueOf(request.getProfileVisibility()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid profile visibility. Must be public_view, platform, or private_view");
            }
        }

        if (request.getOnboardingPath() != null) {
            try {
                user.setOnboardingPath(User.OnboardingPath.valueOf(request.getOnboardingPath().toLowerCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid onboarding path");
            }
        }

        userRepository.save(user);
        return getMe(userId);
    }

    @Transactional
    public UserDto completeOnboarding(String userId, String username, String displayName, String onboardingPath) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userRepository.existsByUsername(username) && !username.equals(user.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        user.setUsername(username);
        user.setDisplayName(displayName);
        try {
            user.setOnboardingPath(User.OnboardingPath.valueOf(onboardingPath.toLowerCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid onboarding path");
        }
        user.setOnboardingCompleted(true);
        userRepository.save(user);
        
        return getMe(userId);
    }

    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr, String ipAddress, String userAgent) {
        UserSession session = userSessionRepository.findByTokenHash(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (Boolean.TRUE.equals(session.getIsRevoked())) {
            throw new RuntimeException("Refresh token is revoked");
        }

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token has expired");
        }

        User user = session.getUser();
        
        if (Boolean.TRUE.equals(user.getIsSuspended())) {
            throw new RuntimeException("Account is suspended");
        }
        
        // Update session's last active tracking
        session.setLastActiveAt(LocalDateTime.now());
        session.setIpAddress(ipAddress);
        session.setUserAgent(userAgent);
        userSessionRepository.save(session);
        
        // Update user's last login tracking implicitly
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String newAccessToken = jwtService.generateToken(user.getUserId(), user.getUsername());
        
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshTokenStr)
                .expiresIn(900)
                .build();
    }

    @Transactional
    public AuthResponse verifyEmailToken(VerifyEmailTokenRequest request, String ipAddress, String userAgent) {
        EmailVerification verification = emailVerificationRepository.findByTokenAndIsUsedFalse(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification token"));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        verification.setIsUsed(true);
        emailVerificationRepository.save(verification);

        User user = userRepository.findById(verification.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmailVerified(true);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return buildAuthResponse(user, ipAddress, userAgent);
    }

    @Transactional
    public void logout(String refreshToken) {
        userSessionRepository.findByTokenHash(refreshToken).ifPresent(session -> {
            session.setIsRevoked(true);
            userSessionRepository.save(session);
        });
    }

    @Transactional
    public void logoutAll(String userId) {
        List<UserSession> sessions = userSessionRepository.findByUser_UserIdAndIsRevokedFalse(userId);
        sessions.forEach(session -> session.setIsRevoked(true));
        userSessionRepository.saveAll(sessions);
    }

    @Transactional
    public void logoutOtherSessions(String userId, String currentSessionId) {
        List<UserSession> sessions = userSessionRepository.findByUser_UserIdAndIsRevokedFalse(userId);
        sessions.stream()
                .filter(session -> !session.getSessionId().equals(currentSessionId))
                .forEach(session -> session.setIsRevoked(true));
        userSessionRepository.saveAll(sessions);
    }

    @Transactional
    public void terminateSession(String userId, String sessionId) {
        userSessionRepository.findById(sessionId).ifPresent(session -> {
            if (session.getUser().getUserId().equals(userId)) {
                session.setIsRevoked(true);
                userSessionRepository.save(session);
            }
        });
    }

    @Transactional(readOnly = true)
    public List<UserSessionDto> getActiveSessions(String userId, String currentTokenHash) {
        return userSessionRepository.findByUser_UserIdAndIsRevokedFalse(userId).stream()
                .map(session -> UserSessionDto.builder()
                        .sessionId(session.getSessionId())
                        .deviceType(session.getDeviceType())
                        .browser(session.getBrowser())
                        .ipAddress(session.getIpAddress())
                        .location(session.getLocation())
                        .lastActiveAt(session.getLastActiveAt())
                        .isCurrent(session.getTokenHash().equals(currentTokenHash))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void requestMobileOtp(MobileAuthRequest request) {
        long attemptsInLastHour = otpVerificationRepository.countByMobileNumberAndCreatedAtAfter(
                request.getMobileNumber(), LocalDateTime.now().minusHours(1));
        
        if (attemptsInLastHour >= 3) {
            throw new RuntimeException("Maximum OTP requests exceeded. Please try again after an hour.");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        log.info("====== DEVELOPMENT MOCK SMS GATEWAY ======");
        log.info("Sending OTP [{}] to mobile number [{}]", otp, request.getMobileNumber());
        log.info("==========================================");

        OtpVerification verification = new OtpVerification();
        verification.setMobileNumber(request.getMobileNumber());
        verification.setOtpHash(passwordEncoder.encode(otp));
        verification.setPurpose(OtpVerification.Purpose.login);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpVerificationRepository.save(verification);
    }

    @Transactional
    public AuthResponse verifyMobileOtpAndLogin(VerifyOtpRequest request, String ipAddress, String userAgent) {
        OtpVerification verification = otpVerificationRepository
                .findByMobileNumberAndIsVerifiedFalseOrderByCreatedAtDesc(request.getMobileNumber())
                .orElseThrow(() -> new RuntimeException("No active OTP found for this number"));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        User user = userRepository.findByMobileNumber(request.getMobileNumber()).orElse(null);
        if (user != null) {
            checkAccountLock(user);
        }

        if (!passwordEncoder.matches(request.getOtp(), verification.getOtpHash())) {
            verification.setAttemptCount(verification.getAttemptCount() + 1);
            otpVerificationRepository.save(verification);
            
            if (user != null) {
                handleFailedLogin(user, request.getMobileNumber(), LoginHistory.LoginMethod.MOBILE, ipAddress, userAgent);
            } else {
                logLoginEvent(null, request.getMobileNumber(), LoginHistory.LoginMethod.MOBILE, ipAddress, userAgent, false, "Invalid OTP");
            }
            throw new RuntimeException("Invalid OTP");
        }

        verification.setIsVerified(true);
        otpVerificationRepository.save(verification);

        if (user == null) {
            User newUser = new User();
            newUser.setMobileNumber(request.getMobileNumber());
            newUser.setUsername("user_" + request.getMobileNumber());
            newUser.setDisplayName("User " + request.getMobileNumber().substring(Math.max(0, request.getMobileNumber().length() - 4)));
            newUser.setOnboardingCompleted(false);
            user = userRepository.save(newUser);
        }

        if (Boolean.TRUE.equals(user.getIsSuspended())) {
            logLoginEvent(user.getUserId(), request.getMobileNumber(), LoginHistory.LoginMethod.MOBILE, ipAddress, userAgent, false, "Account is suspended");
            throw new RuntimeException("Account is suspended");
        }

        resetFailedLogins(user);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        logLoginEvent(user.getUserId(), request.getMobileNumber(), LoginHistory.LoginMethod.MOBILE, ipAddress, userAgent, true, null);

        return buildAuthResponse(user, ipAddress, userAgent);
    }

    @Transactional
    public AuthResponse loginWithGoogle(OAuthLoginRequest request, String ipAddress, String userAgent) {
        try {
            // For development without strict verification, we decode the JWT payload
            String[] chunks = request.getIdToken().split("\\.");
            if (chunks.length < 2) throw new RuntimeException("Invalid ID Token");

            Base64.Decoder decoder = Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));

            String googleId = extractJsonValue(payload, "sub");
            String email = extractJsonValue(payload, "email");
            String rawName = extractJsonValue(payload, "name");
            final String name = rawName != null ? rawName : "Google User";
            String picture = extractJsonValue(payload, "picture");

            if (googleId == null || email == null) {
                throw new RuntimeException("Invalid token payload: missing sub or email");
            }

            User user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                checkAccountLock(user);
            }

            if (user == null) {
                // Create new user
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(email.split("@")[0] + "_" + System.currentTimeMillis() % 1000);
                newUser.setDisplayName(name);
                newUser.setAvatarUrl(picture);
                newUser.setOnboardingCompleted(false);
                user = userRepository.save(newUser);

                OauthProvider newProvider = new OauthProvider();
                newProvider.setUser(user);
                newProvider.setProvider(OauthProvider.Provider.google);
                newProvider.setProviderId(googleId);
                newProvider.setEmail(email);
                oauthProviderRepository.save(newProvider);
            } else {
                // User exists. Check if this provider is linked
                Optional<OauthProvider> existingProvider = oauthProviderRepository.findByProviderAndProviderId(OauthProvider.Provider.google, googleId);
                if (existingProvider.isEmpty()) {
                    // Requires linking confirmation
                    throw new OAuthLinkRequiredException("Account exists. Confirmation required to link.", email);
                }
            }

            if (Boolean.TRUE.equals(user.getIsSuspended())) {
                logLoginEvent(user.getUserId(), email, LoginHistory.LoginMethod.OAUTH, ipAddress, userAgent, false, "Account is suspended");
                throw new RuntimeException("Account is suspended");
            }

            resetFailedLogins(user);
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            logLoginEvent(user.getUserId(), email, LoginHistory.LoginMethod.OAUTH, ipAddress, userAgent, true, null);

            return buildAuthResponse(user, ipAddress, userAgent);
        } catch (OAuthLinkRequiredException e) {
            logLoginEvent(null, e.getEmail(), LoginHistory.LoginMethod.OAUTH, ipAddress, userAgent, false, "OAuth Link Required");
            throw e; // rethrow to be caught by global handler
        } catch (Exception e) {
            log.error("Google OAuth Error", e);
            logLoginEvent(null, null, LoginHistory.LoginMethod.OAUTH, ipAddress, userAgent, false, "Google OAuth Error: " + e.getMessage());
            throw new RuntimeException("Google OAuth Login failed: " + e.getMessage());
        }
    }

    @Transactional
    public AuthResponse linkGoogleAccount(OAuthLoginRequest request, String ipAddress, String userAgent) {
        try {
            String[] chunks = request.getIdToken().split("\\.");
            if (chunks.length < 2) throw new RuntimeException("Invalid ID Token");

            Base64.Decoder decoder = Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));

            String googleId = extractJsonValue(payload, "sub");
            String email = extractJsonValue(payload, "email");

            if (googleId == null || email == null) {
                throw new RuntimeException("Invalid token payload: missing sub or email");
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found to link"));

            Optional<OauthProvider> existingProvider = oauthProviderRepository.findByProviderAndProviderId(OauthProvider.Provider.google, googleId);
            if (existingProvider.isEmpty()) {
                OauthProvider newProvider = new OauthProvider();
                newProvider.setUser(user);
                newProvider.setProvider(OauthProvider.Provider.google);
                newProvider.setProviderId(googleId);
                newProvider.setEmail(email);
                oauthProviderRepository.save(newProvider);
            }

            if (Boolean.TRUE.equals(user.getIsSuspended())) {
                throw new RuntimeException("Account is suspended");
            }

            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            return buildAuthResponse(user, ipAddress, userAgent);
        } catch (Exception e) {
            log.error("Google OAuth Linking Error", e);
            throw new RuntimeException("Google OAuth Linking failed: " + e.getMessage());
        }
    }

    private AuthResponse buildAuthResponse(User user, String ipAddress, String userAgent) {
        String accessToken = jwtService.generateToken(user.getUserId(), user.getUsername());
        String refreshToken = jwtService.generateRefreshToken(user.getUserId(), user.getUsername());

        UserSession session = new UserSession();
        session.setUser(user);
        session.setTokenHash(refreshToken);
        session.setIpAddress(ipAddress);
        session.setUserAgent(userAgent);
        session.setDeviceType(parseDeviceType(userAgent));
        session.setBrowser(parseBrowser(userAgent));
        session.setLocation("Unknown (Mock IP Location)");
        session.setExpiresAt(LocalDateTime.now().plusDays(30));
        userSessionRepository.save(session);

        UserDto userDto = UserDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .platformRole(user.getPlatformRole().name())
                .onboardingCompleted(user.getOnboardingCompleted())
                .onboardingPath(user.getOnboardingPath() != null ? user.getOnboardingPath().name() : null)
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.getIsActive())
                .bio(user.getBio())
                .country(user.getCountry())
                .profileVisibility(user.getProfileVisibility() != null ? user.getProfileVisibility().name() : null)
                .orgRoles(
                    orgMemberRepository.findByUser_UserId(user.getUserId()).stream()
                        .map(member -> UserOrgRoleDto.builder()
                                .orgId(member.getOrganization().getOrgId())
                                .orgName(member.getOrganization().getOrgName())
                                .orgRole(member.getRole().name())
                                .build())
                        .toList()
                )
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(900) // 15 mins
                .user(userDto)
                .build();
    }

    private String extractJsonValue(String json, String key) {
        Pattern pattern = Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private String parseDeviceType(String userAgent) {
        if (userAgent == null) return "Unknown";
        String ua = userAgent.toLowerCase();
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) {
            return "Mobile";
        } else if (ua.contains("tablet") || ua.contains("ipad")) {
            return "Tablet";
        }
        return "Desktop";
    }

    private String parseBrowser(String userAgent) {
        if (userAgent == null) return "Unknown";
        String ua = userAgent.toLowerCase();
        if (ua.contains("edg/")) return "Edge";
        if (ua.contains("chrome/")) return "Chrome";
        if (ua.contains("firefox/")) return "Firefox";
        if (ua.contains("safari/") && !ua.contains("chrome")) return "Safari";
        return "Unknown";
    }

    private void logLoginEvent(String userId, String identifier, LoginHistory.LoginMethod method, String ipAddress, String userAgent, boolean isSuccess, String failureReason) {
        LoginHistory history = LoginHistory.builder()
                .userId(userId)
                .identifier(identifier)
                .loginMethod(method)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .isSuccess(isSuccess)
                .failureReason(failureReason)
                .build();
        loginHistoryRepository.save(history);
    }

    private void checkAccountLock(User user) {
        if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Account is locked due to too many failed login attempts. Please try again later.");
        }
    }

    private void handleFailedLogin(User user, String identifier, LoginHistory.LoginMethod method, String ipAddress, String userAgent) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() != null ? user.getFailedLoginAttempts() + 1 : 1);
        if (user.getFailedLoginAttempts() >= 10) {
            user.setAccountLockedUntil(LocalDateTime.now().plusMinutes(30));
            log.info("====== DEVELOPMENT MOCK NOTIFICATION GATEWAY ======");
            log.info("Sending Account Lock Notification to User [{}] via SMS/Email", user.getUserId());
            log.info("==========================================");
            logLoginEvent(user.getUserId(), identifier, method, ipAddress, userAgent, false, "Account Locked (Max Attempts)");
        } else {
            logLoginEvent(user.getUserId(), identifier, method, ipAddress, userAgent, false, "Invalid credentials");
        }
        userRepository.save(user);
    }

    private void resetFailedLogins(User user) {
        if (user.getFailedLoginAttempts() != null && user.getFailedLoginAttempts() > 0) {
            user.setFailedLoginAttempts(0);
            user.setAccountLockedUntil(null);
            userRepository.save(user);
        }
    }
}
