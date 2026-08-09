package com.smarthire.controller;

import java.util.List;
import java.util.Map;

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
import com.smarthire.enums.InterviewType;
import com.smarthire.enums.JobStatus;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;

import com.smarthire.service.ApplicationService;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    public RecruiterController(
            RecruiterService recruiterService,
            JobService jobService,
            ApplicationService applicationService) {

        this.recruiterService = recruiterService;
        this.jobService = jobService;
        this.applicationService = applicationService;
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
    
    @PostMapping("/drives/{email}")
    public ResponseEntity<Job> postDrive(@PathVariable String email, @Valid @RequestBody PostJobRequest request) {
        Job job = jobService.postJob(email, request);
        return new ResponseEntity<>(job, HttpStatus.CREATED);
    }
    
    @GetMapping("/jobs/{email}")
    public ResponseEntity<List<Job>> getRecruiterJobs(
            @PathVariable String email) {

        List<Job> jobs = jobService.getJobsByRecruiter(email);

        return ResponseEntity.ok(jobs);
    }
    
    @PatchMapping("/jobs/{id}/{email}/status")
    public ResponseEntity<Job> updateJobStatus(
            @PathVariable Long id,
            @PathVariable String email,
            @RequestParam JobStatus status) {

        Job updatedJob =
                jobService.updateJobStatus(id, email, status);

        return ResponseEntity.ok(updatedJob);
    }
    
    @PutMapping("/jobs/{id}/{email}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @PathVariable String email,
            @Valid @RequestBody PostJobRequest request) {
        return ResponseEntity.ok(
                jobService.updateJob(id, email, request)
        );
    }

    @DeleteMapping("/jobs/{id}/{email}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long id,
            @PathVariable String email) {

        jobService.deleteJob(id, email);

        return ResponseEntity.ok("Job deleted successfully");
    }
    @PutMapping("/applications/{applicationId}/shortlist")
    public ResponseEntity<?> shortlistApplication(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> request) {

        try {

            LocalDate interviewDate =
                    LocalDate.parse(
                            request.get("interviewDate")
                    );

            LocalTime interviewTime =
                    LocalTime.parse(
                            request.get("interviewTime")
                    );
            
            InterviewType interviewType =
                    InterviewType.valueOf(
                            request.get("interviewType")
                                    .toUpperCase()
                    );

            String interviewLocation =
                    request.get("interviewLocation");

            applicationService.shortlistApplication(
                    applicationId,
                    interviewDate,
                    interviewTime,
                    interviewType,
                    interviewLocation
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Applicant shortlisted successfully"
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Failed to shortlist applicant"
                            )
                    );
        }
    }
    @PutMapping("/applications/{applicationId}/approve")
    public ResponseEntity<?> approveApplication(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> request) {

        try {

            LocalDate joiningDate =
                    LocalDate.parse(
                            request.get("joiningDate")
                    );

            applicationService.approveApplication(
                    applicationId,
                    joiningDate
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Applicant approved successfully"
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Failed to approve applicant"
                            )
                    );
        }
    }@PutMapping("/applications/{applicationId}/reject")
    public ResponseEntity<?> rejectApplication(
            @PathVariable Long applicationId) {

        try {

            applicationService.rejectApplication(
                    applicationId
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Applicant rejected successfully"
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Failed to reject applicant"
                            )
                    );
        }
    }

}