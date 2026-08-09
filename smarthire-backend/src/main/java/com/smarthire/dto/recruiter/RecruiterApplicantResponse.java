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
    
    private Integer resumeScore;

    private String resumeScoreStatus;

    private String resumeScoreSummary;

    private String matchedSkills;

    private String missingSkills;

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
            LocalDateTime appliedAt,
            Integer resumeScore,
            String resumeScoreStatus,
            String resumeScoreSummary,
            String matchedSkills,
            String missingSkills
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

        // AI RESUME SCORE
        this.resumeScore = resumeScore;
        this.resumeScoreStatus = resumeScoreStatus;
        this.resumeScoreSummary = resumeScoreSummary;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
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

	public Integer getResumeScore() {
		return resumeScore;
	}

	public void setResumeScore(Integer resumeScore) {
		this.resumeScore = resumeScore;
	}

	public String getResumeScoreStatus() {
		return resumeScoreStatus;
	}

	public void setResumeScoreStatus(String resumeScoreStatus) {
		this.resumeScoreStatus = resumeScoreStatus;
	}

	public String getResumeScoreSummary() {
		return resumeScoreSummary;
	}

	public void setResumeScoreSummary(String resumeScoreSummary) {
		this.resumeScoreSummary = resumeScoreSummary;
	}

	public String getMatchedSkills() {
		return matchedSkills;
	}

	public void setMatchedSkills(String matchedSkills) {
		this.matchedSkills = matchedSkills;
	}

	public String getMissingSkills() {
		return missingSkills;
	}

	public void setMissingSkills(String missingSkills) {
		this.missingSkills = missingSkills;
	}
    
}