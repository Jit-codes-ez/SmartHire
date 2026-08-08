package com.smarthire.service;

import com.smarthire.dto.recruiter.PostJobRequest;
import com.smarthire.entity.Job;

import java.util.List;

public interface JobService {

    Job postJob(String email, PostJobRequest request);

    List<Job> getJobsByRecruiter(String email);
}