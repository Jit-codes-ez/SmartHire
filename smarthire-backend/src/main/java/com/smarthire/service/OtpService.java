package com.smarthire.service;

import com.smarthire.enums.OtpPurpose;

public interface OtpService {
    void generateAndSendOtp(String email, OtpPurpose purpose);
    void verifyOtp(String email, String otp, OtpPurpose purpose);
    boolean isEmailVerified(String email, OtpPurpose purpose);
}