package com.smarthire.controller;

import com.smarthire.dto.recruiter.RecruiterApplicantResponse;
import com.smarthire.service.ApplicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "http://localhost:5173")
public class RecruiterApplicationController {

    private final ApplicationService applicationService;

    public RecruiterApplicationController(
            ApplicationService applicationService) {

        this.applicationService = applicationService;
    }

    // ==========================================
    // GET APPLICANTS FOR DRIVE / JOB
    // GET /api/recruiter/drives/{jobId}/applicants
    // ==========================================

    @GetMapping("/drives/{jobId}/applicants")
    public ResponseEntity<?> getApplicants(
            @PathVariable Long jobId) {

        try {

            List<RecruiterApplicantResponse> applicants =
                    applicationService.getApplicantsByJob(jobId);

            return ResponseEntity.ok(applicants);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}