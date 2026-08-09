package com.smarthire.service;

import java.time.LocalDate;
import java.time.LocalTime;

import com.smarthire.enums.InterviewType;

public interface EmailService {

    void sendOtpEmail(String toEmail, String otp);

    void sendRecruiterApprovalEmail(String toEmail, String fullName);

    void sendRecruiterRejectionEmail(String toEmail, String fullName, String adminEmail);
    
    void sendStudentDeletionEmail(String toEmail, String fullName, String reason);
    
    void sendRecruiterDeletionEmail(String toEmail, String fullName, String reason);
    
    void sendStudentShortlistEmail(String toEmail, String fullName, String jobTitle, LocalDate interviewDate, LocalTime interviewTime, InterviewType interviewType, String interviewLocation);

    void sendStudentApprovalEmail(String toEmail, String fullName, String jobTitle, LocalDate joiningDate);

    void sendStudentRejectionEmail(String toEmail, String fullName, String jobTitle);
}