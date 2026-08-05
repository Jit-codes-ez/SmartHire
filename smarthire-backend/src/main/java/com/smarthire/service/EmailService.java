package com.smarthire.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otp);
}