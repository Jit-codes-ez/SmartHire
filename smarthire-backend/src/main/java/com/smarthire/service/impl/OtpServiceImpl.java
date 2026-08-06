package com.smarthire.service.impl;

import com.smarthire.enums.OtpPurpose;
import com.smarthire.exception.InvalidOtpException;
import com.smarthire.service.EmailService;
import com.smarthire.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpServiceImpl implements OtpService {

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    @Autowired
    private EmailService emailService;

    // Purpose-scoped key so a LOGIN otp and a REGISTRATION otp for the same
    // email never collide or cross-verify each other.
    private String buildKey(String email, OtpPurpose purpose) {
        return purpose.name() + ":" + email.toLowerCase();
    }

    @Override
    public void generateAndSendOtp(String email, OtpPurpose purpose) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(buildKey(email, purpose), new OtpEntry(otp, LocalDateTime.now().plusMinutes(10), false));
        emailService.sendOtpEmail(email, otp);
    }

    @Override
    public void verifyOtp(String email, String otp, OtpPurpose purpose) {

        String key = buildKey(email, purpose);
        OtpEntry entry = otpStore.get(key);

        System.out.println("==================================");
        System.out.println("Purpose        : " + purpose);
        System.out.println("Email Received : " + email);
        System.out.println("Entered OTP    : " + otp);

        if (entry != null) {
            System.out.println("Stored OTP     : " + entry.otp);
            System.out.println("Verified       : " + entry.verified);
            System.out.println("Expires At     : " + entry.expiresAt);
        } else {
            System.out.println("No OTP stored for this email/purpose");
        }
        System.out.println("==================================");

        if (entry == null) {
            throw new InvalidOtpException("No OTP found for this email. Please request a new one.");
        }

        if (entry.expiresAt.isBefore(LocalDateTime.now())) {
            throw new InvalidOtpException("OTP has expired. Please request a new one.");
        }

        if (!entry.otp.equals(otp)) {
            throw new InvalidOtpException("Incorrect OTP.");
        }

        entry.verified = true;
    }

    @Override
    public boolean isEmailVerified(String email, OtpPurpose purpose) {
        OtpEntry entry = otpStore.get(buildKey(email, purpose));
        return entry != null && entry.verified;
    }

    private static class OtpEntry {
        String otp;
        LocalDateTime expiresAt;
        boolean verified;

        OtpEntry(String otp, LocalDateTime expiresAt, boolean verified) {
            this.otp = otp;
            this.expiresAt = expiresAt;
            this.verified = verified;
        }
    }
}