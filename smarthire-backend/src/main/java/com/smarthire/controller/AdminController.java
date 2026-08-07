package com.smarthire.controller;

import com.smarthire.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Admin dashboard statistics
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Long>> getDashboard() {

        return ResponseEntity.ok(adminService.getDashboard());
    }
    
    // Get pending recruiter requests
    @GetMapping("/recruiters/pending")
    public ResponseEntity<List<?>> getPendingRecruiters() {

        return ResponseEntity.ok(adminService.getPendingRecruiters());
    }
    
    // Approve recruiter
    @PutMapping("/recruiters/{id}/approve")
    public ResponseEntity<String> approveRecruiter(@PathVariable Long id) {
        adminService.approveRecruiter(id);
        return ResponseEntity.ok("Recruiter approved successfully");
    }
    
    // Reject recruiter
    @PutMapping("/recruiters/{id}/reject")
    public ResponseEntity<String> rejectRecruiter(
            @PathVariable Long id) {

        adminService.rejectRecruiter(id);

        return ResponseEntity.ok("Recruiter rejected successfully");
    }
    
}