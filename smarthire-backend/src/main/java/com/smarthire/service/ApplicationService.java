package com.smarthire.service;

import com.smarthire.dto.job_application.JobApplicationResponse;
import com.smarthire.dto.recruiter.RecruiterApplicantResponse;
import com.smarthire.entity.Application;
import com.smarthire.enums.InterviewType;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ApplicationService {

    // Student
    Application applyForJob(
            String email,
            Long jobId
    );

    boolean hasApplied(
            String email,
            Long jobId
    );

    List<JobApplicationResponse> getMyApplications(
            String email
    );

    // Recruiter
    List<RecruiterApplicantResponse> getApplicantsByJob(
            Long jobId
    );

    Application shortlistApplication(
            Long applicationId,
            LocalDate interviewDate,
            LocalTime interviewTime,
            InterviewType interviewType,
            String interviewLocation
    );

    Application approveApplication(
            Long applicationId,
            LocalDate joiningDate
    );

    Application rejectApplication(
            Long applicationId
    );
}