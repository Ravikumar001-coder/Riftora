package com.gameverse.modules.auth.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrDataFactory;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class TotpService {

    private final SecretGenerator secretGenerator;
    private final QrDataFactory qrDataFactory;
    private final QrGenerator qrGenerator;
    private final CodeVerifier codeVerifier;
    private final UserRepository userRepository;

    @Transactional
    public String generateSecret(String userId, String email) {
        String secret = secretGenerator.generate();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setTotpSecret(secret);
        userRepository.save(user);
        return secret;
    }

    public String getQrCodeUrl(String secret, String email) throws QrGenerationException {
        QrData data = qrDataFactory.newBuilder()
                .label(email)
                .secret(secret)
                .issuer("GameVerse")
                .build();

        return dev.samstevens.totp.util.Utils.getDataUriForImage(
                qrGenerator.generate(data),
                qrGenerator.getImageMimeType()
        );
    }

    @Transactional
    public boolean verifyAndEnable(String userId, String code) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTotpSecret() == null) {
            throw new RuntimeException("TOTP secret not generated");
        }

        boolean isValid = codeVerifier.isValidCode(user.getTotpSecret(), code);
        if (isValid) {
            user.setIsTotpEnabled(true);
            userRepository.save(user);
        }
        return isValid;
    }

    public boolean verify(String secret, String code) {
        return codeVerifier.isValidCode(secret, code);
    }

    @Transactional
    public void disable(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsTotpEnabled(false);
        user.setTotpSecret(null);
        userRepository.save(user);
    }
}
