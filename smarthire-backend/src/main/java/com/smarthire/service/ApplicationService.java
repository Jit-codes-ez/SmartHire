package com.smarthire.service;

import com.smarthire.dto.job_application.JobApplicationResponse;
import com.smarthire.entity.Application;

import java.util.List;

public interface ApplicationService {

    Application applyForJob(String email, Long jobId);

    boolean hasApplied(String email, Long jobId);

    List<JobApplicationResponse> getMyApplications(String email);
}