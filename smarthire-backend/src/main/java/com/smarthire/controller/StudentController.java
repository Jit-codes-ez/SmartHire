package com.smarthire.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smarthire.dto.auth.LoginRequest;
import com.smarthire.dto.auth.LoginResponse;
import com.smarthire.dto.student.StudentRegistrationRequest;
import com.smarthire.dto.student.StudentRegistrationResponse;
import com.smarthire.entity.Student;
import com.smarthire.service.StudentService;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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

    // Get Student Profile by Email
    @GetMapping("/profile/{email}")
    public ResponseEntity<Student> getProfile(
            @PathVariable String email) {

        Student student = studentService.getStudentByEmail(email);
        return ResponseEntity.ok(student);
    }
    @PutMapping("/profile/{email}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String email,
            @RequestBody Student student
    ){
        return ResponseEntity.ok(
            studentService.updateProfile(email, student)
        );
    }

}