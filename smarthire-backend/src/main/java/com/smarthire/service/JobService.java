package com.smarthire.service;

import com.smarthire.dto.recruiter.PostJobRequest;
import com.smarthire.entity.Job;
import com.smarthire.enums.JobStatus;

import java.util.List;

public interface JobService {

    // Recruiter
    Job postJob(String email, PostJobRequest request);

    List<Job> getJobsByRecruiter(String email);

    Job updateJobStatus(
            Long id,
            String email,
            JobStatus status
    );

    Job updateJob(
            Long jobId,
            String email,
            PostJobRequest request
    );

    void deleteJob(
            Long jobId,
            String email
    );

    // Student
    List<Job> getOpenJobs();

    Job getJobById(Long id);
}