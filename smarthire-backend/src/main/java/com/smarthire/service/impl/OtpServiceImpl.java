package com.smarthire.service.impl;

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

    @Override
    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, new OtpEntry(otp, LocalDateTime.now().plusMinutes(10), false));
        emailService.sendOtpEmail(email, otp);
    }

    @Override
    public void verifyOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email);
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
    public boolean isEmailVerified(String email) {
        OtpEntry entry = otpStore.get(email);
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