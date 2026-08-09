package com.smarthire.dto.recruiter;

import java.time.LocalDateTime;

public class RecruiterApplicantResponse {

    private Long applicationId;

    private Long studentId;

    private String fullName;

    private String email;

    private String mobileNumber;

    private String skills;

    private String branch;

    private Double cgpa;

    private String resumeUrl;

    private String status;

    private LocalDateTime appliedAt;

    public RecruiterApplicantResponse() {
    }

    public RecruiterApplicantResponse(
            Long applicationId,
            Long studentId,
            String fullName,
            String email,
            String mobileNumber,
            String skills,
            String branch,
            Double cgpa,
            String resumeUrl,
            String status,
            LocalDateTime appliedAt
    ) {
        this.applicationId = applicationId;
        this.studentId = studentId;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.skills = skills;
        this.branch = branch;
        this.cgpa = cgpa;
        this.resumeUrl = resumeUrl;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
}