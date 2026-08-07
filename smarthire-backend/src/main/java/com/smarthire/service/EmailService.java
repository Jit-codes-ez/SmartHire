package com.smarthire.service;

public interface EmailService {

    void sendOtpEmail(String toEmail, String otp);

    void sendRecruiterApprovalEmail(String toEmail, String fullName);

    void sendRecruiterRejectionEmail(String toEmail, String fullName);
}