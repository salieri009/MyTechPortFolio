package com.mytechfolio.portfolio.security.util;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TwoFactorAuthUtil {
    
    private static final Logger log = LoggerFactory.getLogger(TwoFactorAuthUtil.class);
    
    private final SecretGenerator secretGenerator;
    private final QrGenerator qrGenerator;
    private final CodeGenerator codeGenerator;
    private final CodeVerifier codeVerifier;
    private final String issuer;
    
    public TwoFactorAuthUtil(@Value("${app.2fa.issuer:MyPortfolio}") String issuer) {
        this.issuer = issuer;
        this.secretGenerator = new DefaultSecretGenerator();
        this.qrGenerator = new ZxingPngQrGenerator();
        this.codeGenerator = new DefaultCodeGenerator();
        
        TimeProvider timeProvider = new SystemTimeProvider();
        this.codeVerifier = new DefaultCodeVerifier(this.codeGenerator, timeProvider);
    }
    
    /**
     * Generate a new secret for 2FA setup
     */
    public String generateSecret() {
        return secretGenerator.generate();
    }
    
    /**
     * Generate QR code data URI for 2FA setup
     */
    public String generateQrCodeDataUri(String email, String secret) {
        try {
            QrData data = new QrData.Builder()
                    .label(email)
                    .secret(secret)
                    .issuer(issuer)
                    .build();
            
            byte[] qrCodeBytes = qrGenerator.generate(data);
            String base64 = java.util.Base64.getEncoder().encodeToString(qrCodeBytes);
            return "data:image/png;base64," + base64;
        } catch (QrGenerationException e) {
            log.error("Failed to generate QR code for user {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }
    
    /**
     * Verify 2FA code
     */
    public boolean verifyCode(String secret, String code) {
        try {
            return codeVerifier.isValidCode(secret, code);
        } catch (Exception e) {
            log.error("Failed to verify 2FA code: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Generate current 2FA code (for testing purposes)
     */
    public String generateCurrentCode(String secret) {
        try {
            long currentTimeSlot = System.currentTimeMillis() / 1000 / 30;
            return codeGenerator.generate(secret, currentTimeSlot);
        } catch (Exception e) {
            log.error("Failed to generate current code: {}", e.getMessage());
            throw new RuntimeException("Failed to generate current code", e);
        }
    }
}
