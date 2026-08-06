package com.smarthire.controller;

import com.smarthire.dto.auth.LoginRequest;
import com.smarthire.dto.auth.LoginResponse;
import com.smarthire.dto.auth.SendOtpRequest;
import com.smarthire.dto.auth.VerifyOtpRequest;
import com.smarthire.dto.auth.VerifyOtpResponse;
import com.smarthire.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class AuthController {


    @Autowired
    private AuthService authService;



    // Normal login using email + password
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }



    // Send OTP
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(
            @RequestBody SendOtpRequest request
    ) {

        authService.sendOtp(request);

        return ResponseEntity.ok(
                "OTP sent successfully"
        );
    }



    // Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(
            @RequestBody VerifyOtpRequest request
    ) {

        return ResponseEntity.ok(
                authService.verifyOtp(request)
        );
    }



    // Logout
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader("Authorization") String authHeader
    ) {

        String token = authHeader.substring(7);

        authService.logout(token);

        return ResponseEntity.ok(
                "Logout successful"
        );
    }
}