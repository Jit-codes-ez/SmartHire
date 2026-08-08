package com.smarthire.service.impl;

import org.springframework.stereotype.Service;

import com.smarthire.dto.recruiter.PostJobRequest;
import com.smarthire.entity.Job;
import com.smarthire.entity.Recruiter;
import com.smarthire.entity.User;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.RecruiterRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.JobService;

import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final RecruiterRepository recruiterRepository;

    public JobServiceImpl(
            JobRepository jobRepository,
            UserRepository userRepository,
            RecruiterRepository recruiterRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.recruiterRepository = recruiterRepository;
    }

    @Override
    public Job postJob(String email, PostJobRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter user not found"));

        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter profile not found"));

        Job job = new Job();

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setSalary(request.getSalary());
        job.setSkills(request.getSkills());
        job.setApplicationDeadline(
                request.getApplicationDeadline()
        );

        job.setStatus("ACTIVE");
        job.setRecruiter(recruiter);

        return jobRepository.save(job);
    }

    @Override
    public List<Job> getJobsByRecruiter(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter user not found"));

        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter profile not found"));

        return jobRepository.findByRecruiter(recruiter);
    }
}