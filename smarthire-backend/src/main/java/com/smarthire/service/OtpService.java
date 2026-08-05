package com.smarthire.service;

public interface OtpService {
    void generateAndSendOtp(String email);
    void verifyOtp(String email, String otp);
    boolean isEmailVerified(String email);
}