package com.gameverse.modules.game.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.game.dto.AddLinkedAccountRequest;
import com.gameverse.modules.game.dto.LinkedGameAccountDto;
import com.gameverse.modules.game.dto.PublicLinkedAccountDto;
import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.game.entity.LinkedGameAccount;
import com.gameverse.modules.game.repository.GameRepository;
import com.gameverse.modules.game.repository.LinkedGameAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LinkedGameAccountService {

    private final LinkedGameAccountRepository linkedGameAccountRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<LinkedGameAccountDto> getLinkedAccounts(String userId) {
        return linkedGameAccountRepository.findByUser_UserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PublicLinkedAccountDto> getVerifiedPublicAccounts(String userId) {
        return linkedGameAccountRepository.findByUser_UserId(userId).stream()
                .filter(account -> account.getStatus() == LinkedGameAccount.LinkStatus.verified)
                .map(this::mapToPublicDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PublicLinkedAccountDto> getVerifiedPublicAccountsByUsername(String username) {
        return linkedGameAccountRepository.findByUser_Username(username).stream()
                .filter(account -> account.getStatus() == LinkedGameAccount.LinkStatus.verified)
                .map(this::mapToPublicDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LinkedGameAccountDto addLinkedAccount(String userId, AddLinkedAccountRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new IllegalArgumentException("Game not found"));

        if (linkedGameAccountRepository.existsByUser_UserIdAndGame_GameIdAndInGameUid(userId, game.getGameId(), request.getInGameUid())) {
            throw new IllegalArgumentException("This game account is already linked to your profile");
        }

        LinkedGameAccount linkedGameAccount = new LinkedGameAccount();
        linkedGameAccount.setUser(user);
        linkedGameAccount.setGame(game);
        linkedGameAccount.setInGameUid(request.getInGameUid());
        linkedGameAccount.setInGameName(request.getInGameName());
        linkedGameAccount.setStatus(LinkedGameAccount.LinkStatus.pending);

        LinkedGameAccount saved = linkedGameAccountRepository.save(linkedGameAccount);
        return mapToDto(saved);
    }

    @Transactional
    public LinkedGameAccountDto generateVerificationChallenge(String userId, String linkedId) {
        LinkedGameAccount account = linkedGameAccountRepository.findById(linkedId)
                .orElseThrow(() -> new IllegalArgumentException("Linked account not found"));

        if (!account.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to access this account");
        }

        if (account.getStatus() == LinkedGameAccount.LinkStatus.verified) {
            throw new IllegalStateException("Account is already verified");
        }

        // Generate a random 6-character code
        String code = "GVR-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        account.setVerificationCode(code);
        
        LinkedGameAccount saved = linkedGameAccountRepository.save(account);
        return mapToDto(saved);
    }

    @Transactional
    public LinkedGameAccountDto verifyChallenge(String userId, String linkedId) {
        LinkedGameAccount account = linkedGameAccountRepository.findById(linkedId)
                .orElseThrow(() -> new IllegalArgumentException("Linked account not found"));

        if (!account.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to access this account");
        }

        if (account.getVerificationCode() == null) {
            throw new IllegalStateException("No verification challenge exists for this account");
        }

        // MOCK: In a real system, we would query the third-party game API to check if 
        // the player's in-game name matches account.getVerificationCode().
        // Here, we simulate a successful API call.
        account.setStatus(LinkedGameAccount.LinkStatus.verified);
        account.setVerifiedAt(LocalDateTime.now());
        account.setVerificationMethod(LinkedGameAccount.VerificationMethod.challenge);
        
        LinkedGameAccount saved = linkedGameAccountRepository.save(account);
        return mapToDto(saved);
    }

    @Transactional
    public LinkedGameAccountDto manualVerify(String linkedId) {
        LinkedGameAccount account = linkedGameAccountRepository.findById(linkedId)
                .orElseThrow(() -> new IllegalArgumentException("Linked account not found"));

        account.setStatus(LinkedGameAccount.LinkStatus.verified);
        account.setVerifiedAt(LocalDateTime.now());
        account.setVerificationMethod(LinkedGameAccount.VerificationMethod.manual);
        
        LinkedGameAccount saved = linkedGameAccountRepository.save(account);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteLinkedAccount(String userId, String linkedId) {
        LinkedGameAccount account = linkedGameAccountRepository.findById(linkedId)
                .orElseThrow(() -> new IllegalArgumentException("Linked account not found"));

        if (!account.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to delete this account");
        }

        linkedGameAccountRepository.delete(account);
    }

    private LinkedGameAccountDto mapToDto(LinkedGameAccount entity) {
        return LinkedGameAccountDto.builder()
                .linkedId(entity.getLinkedId())
                .gameId(entity.getGame().getGameId())
                .gameName(entity.getGame().getGameName())
                .gameCode(entity.getGame().getGameCode())
                .inGameUid(entity.getInGameUid())
                .inGameName(entity.getInGameName())
                .isPrimary(entity.getIsPrimary())
                .status(entity.getStatus().name())
                .verifiedAt(entity.getVerifiedAt())
                .createdAt(entity.getCreatedAt())
                .verificationMethod(entity.getVerificationMethod() != null ? entity.getVerificationMethod().name() : null)
                .verificationCode(entity.getVerificationCode())
                .build();
    }

    private PublicLinkedAccountDto mapToPublicDto(LinkedGameAccount entity) {
        String uid = entity.getInGameUid();
        String maskedUid = maskUid(uid);
        
        return PublicLinkedAccountDto.builder()
                .gameName(entity.getGame().getGameName())
                .gameCode(entity.getGame().getGameCode())
                .inGameName(entity.getInGameName())
                .maskedUid(maskedUid)
                .build();
    }

    private String maskUid(String uid) {
        if (uid == null) return null;
        if (uid.length() <= 4) {
            return "***" + uid.substring(Math.max(0, uid.length() - 1));
        }
        int keepStart = Math.min(3, uid.length() / 3);
        int keepEnd = Math.min(3, uid.length() / 3);
        
        String start = uid.substring(0, keepStart);
        String end = uid.substring(uid.length() - keepEnd);
        return start + "***" + end;
    }
}
