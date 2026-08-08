package com.smarthire.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smarthire.dto.recruiter.RecruiterProfileResponse;
import com.smarthire.dto.recruiter.RecruiterRegistrationRequest;
import com.smarthire.dto.recruiter.RecruiterRegistrationResponse;
import com.smarthire.service.JobService;
import com.smarthire.service.RecruiterService;
import com.smarthire.dto.recruiter.PostJobRequest;
import com.smarthire.entity.Job;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final JobService jobService;

    public RecruiterController(
            RecruiterService recruiterService,
            JobService jobService) {

        this.recruiterService = recruiterService;
        this.jobService = jobService;
    }

    @PostMapping("/register")
    public ResponseEntity<RecruiterRegistrationResponse> registerRecruiter(
            @Valid @RequestBody RecruiterRegistrationRequest request) {
    	
    	System.out.println("Recruiter Registration API Hit");
        RecruiterRegistrationResponse response =
                recruiterService.registerRecruiter(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/profile/{email}")
    public ResponseEntity<RecruiterProfileResponse> getRecruiterProfile(
            @PathVariable String email) {

        RecruiterProfileResponse response =
                recruiterService.getRecruiterProfile(email);

        return ResponseEntity.ok(response);
    }
    @PutMapping("/profile/{email}")
    public ResponseEntity<RecruiterProfileResponse> updateRecruiterProfile(
            @PathVariable String email,
            @RequestBody RecruiterProfileResponse request) {

        RecruiterProfileResponse response =
                recruiterService.updateRecruiterProfile(
                        email,
                        request
                );

        return ResponseEntity.ok(response);
    }
    @PostMapping("/jobs/{email}")
    public ResponseEntity<Job> postJob(
            @PathVariable String email,
            @Valid @RequestBody PostJobRequest request) {

        Job job = jobService.postJob(email, request);

        return new ResponseEntity<>(
                job,
                HttpStatus.CREATED
        );
    }
    @GetMapping("/jobs/{email}")
    public ResponseEntity<List<Job>> getRecruiterJobs(
            @PathVariable String email) {

        List<Job> jobs = jobService.getJobsByRecruiter(email);

        return ResponseEntity.ok(jobs);
    }

}