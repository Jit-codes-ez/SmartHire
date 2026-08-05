package com.smarthire.controller;

import com.smarthire.dto.student.StudentLoginRequest;
import com.smarthire.dto.student.StudentRegistrationRequest;
import com.smarthire.service.StudentAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentAuthController {

    private final StudentAuthService studentAuthService;

    public StudentAuthController(StudentAuthService studentAuthService) {
        this.studentAuthService = studentAuthService;
    }

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> register(
            @ModelAttribute StudentRegistrationRequest request,
            @RequestParam("resume") MultipartFile resume) {

        return ResponseEntity.ok(studentAuthService.register(request, resume));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody StudentLoginRequest request) {

        return ResponseEntity.ok(studentAuthService.login(request));
    }
}