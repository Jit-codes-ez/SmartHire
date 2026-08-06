package com.smarthire.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smarthire.dto.recruiter.RecruiterRegistrationRequest;
import com.smarthire.dto.recruiter.RecruiterRegistrationResponse;
import com.smarthire.service.RecruiterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @PostMapping("/register")
    public ResponseEntity<RecruiterRegistrationResponse> registerRecruiter(
            @Valid @RequestBody RecruiterRegistrationRequest request) {
    	
    	System.out.println("Recruiter Registration API Hit");
        RecruiterRegistrationResponse response =
                recruiterService.registerRecruiter(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}