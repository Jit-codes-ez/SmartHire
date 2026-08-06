package com.smarthire.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.smarthire.dto.student.StudentRegistrationRequest;
import com.smarthire.dto.student.StudentRegistrationResponse;
import com.smarthire.service.StudentService;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173",allowCredentials = "true")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Student Registration
    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<StudentRegistrationResponse> registerStudent(
            @ModelAttribute StudentRegistrationRequest request) {

        StudentRegistrationResponse response = studentService.registerStudent(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

 
//    // Student Login
//    @PostMapping("/login")
//    public ResponseEntity<StudentLoginResponse> loginStudent(
//            @RequestBody StudentLoginRequest request) {
//
//        StudentLoginResponse response = studentService.loginStudent(request);
//
//        return ResponseEntity.ok(response);
//    }
//
//   // Student Logout
//    @PostMapping("/logout")
//    public ResponseEntity<String> logoutStudent(
//            @RequestHeader("Authorization") String token) {
//
//        studentService.logoutStudent(token);
//
//        return ResponseEntity.ok("Logged out successfully.");
//    }

}