package com.smarthire.controller;

import com.smarthire.dto.recruiter.RecruiterApplicantResponse;
import com.smarthire.entity.Application;
import com.smarthire.service.ApplicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;


    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService =
                applicationService;
    }


    // ==========================================
    // APPLY FOR JOB
    // POST /api/applications/apply/1?email=...
    // ==========================================

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyForJob(
            @PathVariable Long jobId,
            @RequestParam String email) {

        try {

            Application application =
                    applicationService.applyForJob(
                            email,
                            jobId
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Application submitted successfully",

                            "applicationId",
                            application.getId(),

                            "status",
                            application.getStatus()
                    )
            );

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


    // ==========================================
    // CHECK IF ALREADY APPLIED
    // GET /api/applications/check/1?email=...
    // ==========================================

    @GetMapping("/check/{jobId}")
    public ResponseEntity<?> hasApplied(
            @PathVariable Long jobId,
            @RequestParam String email) {

        boolean applied =
                applicationService.hasApplied(
                        email,
                        jobId
                );

        return ResponseEntity.ok(
                Map.of(
                        "applied",
                        applied
                )
        );
    }


    // ==========================================
    // MY APPLICATIONS
    // GET /api/applications/my?email=...
    // ==========================================

    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(
            @RequestParam String email) {

        try {

            return ResponseEntity.ok(
                    applicationService
                            .getMyApplications(email)
            );

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
 // ==========================================
 // RECRUITER - GET APPLICANTS FOR JOB
 // GET /api/recruiter/drives/{jobId}/applicants
 // ==========================================

 @GetMapping("/recruiter/drives/{jobId}/applicants")
 public ResponseEntity<?> getApplicantsByJob(
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