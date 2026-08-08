package com.smarthire.controller;

import com.smarthire.dto.AdminResponse;
import com.smarthire.entity.User;
import com.smarthire.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
 // Get all recruiters
    @GetMapping("/recruiters")
    public ResponseEntity<List<?>> getAllRecruiters() {
        return ResponseEntity.ok(adminService.getAllRecruiters());
    }
    
    // Approve recruiter
    @PutMapping("/recruiters/{id}/approve")
    public ResponseEntity<String> approveRecruiter(@PathVariable Long id) {
        adminService.approveRecruiter(id);
        return ResponseEntity.ok("Recruiter approved successfully");
    }
    @DeleteMapping("/recruiters/{id}")
    public ResponseEntity<String> deleteRecruiter(@PathVariable Long id) {

        adminService.deleteRecruiter(id);

        return ResponseEntity.ok("Recruiter deleted successfully");
    }
    // Reject recruiter
    @PutMapping("/recruiters/{id}/reject")
    public ResponseEntity<String> rejectRecruiter(
            @PathVariable Long id) {

        adminService.rejectRecruiter(id);

        return ResponseEntity.ok("Recruiter rejected successfully");
    }
    
    // Show Admin
    @GetMapping("/admins")
    public List<AdminResponse> getAllAdmins() {
        return adminService.getAllAdmins();
    }
    
 // Add Admin
    @PostMapping("/addAdmin")
    public ResponseEntity<String> addAdmin(@RequestBody User admin) {

        adminService.addAdmin(admin);

        return ResponseEntity.ok("Admin created successfully");
    }
    
    @DeleteMapping("/admins/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String loggedInEmail = authentication.getName();

        adminService.deleteAdmin(id, loggedInEmail);

        return ResponseEntity.ok("Admin deleted successfully");
    }
    
}