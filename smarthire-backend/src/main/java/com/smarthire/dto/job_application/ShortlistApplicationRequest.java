package com.smarthire.dto.job_application;

import com.smarthire.enums.InterviewType;

import jakarta.validation.constraints.NotBlank;

public class ShortlistApplicationRequest {

    @NotBlank
    private String interviewDate;

    @NotBlank
    private String interviewTime;

    @NotBlank
    private InterviewType interviewType;

    @NotBlank
    private String interviewLocation;

    public ShortlistApplicationRequest() {
    }

    public String getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(String interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getInterviewTime() {
        return interviewTime;
    }

    public void setInterviewTime(String interviewTime) {
        this.interviewTime = interviewTime;
    }

    public InterviewType getInterviewType() {
		return interviewType;
	}

	public void setInterviewType(InterviewType interviewType) {
		this.interviewType = interviewType;
	}

	public String getInterviewLocation() {
        return interviewLocation;
    }

    public void setInterviewLocation(String interviewLocation) {
        this.interviewLocation = interviewLocation;
    }
}