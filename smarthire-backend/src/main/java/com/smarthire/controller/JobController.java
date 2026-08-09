package com.smarthire.controller;

import com.smarthire.entity.Job;
import com.smarthire.service.JobService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // ==========================================
    // GET ALL OPEN JOBS
    // GET /api/jobs/open
    // ==========================================
    @GetMapping("/open")
    public ResponseEntity<List<Job>> getOpenJobs() {

        return ResponseEntity.ok(
                jobService.getOpenJobs()
        );
    }

    // ==========================================
    // GET JOB BY ID
    // GET /api/jobs/{id}
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                jobService.getJobById(id)
        );
    }
}