package com.smarthire.service;

public interface EmailService {

    void sendOtpEmail(String toEmail, String otp);

    void sendRecruiterApprovalEmail(String toEmail, String fullName);

    void sendRecruiterRejectionEmail(String toEmail, String fullName, String adminEmail);
    
    void sendStudentDeletionEmail(String toEmail, String fullName, String reason);
    
    void sendRecruiterDeletionEmail(String toEmail, String fullName, String reason);
}