package com.smarthire.controller;

import com.smarthire.dto.auth.LoginRequest;
import com.smarthire.dto.auth.LoginResponse;
import com.smarthire.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.smarthire.dto.auth.ForgotPasswordRequest;
import com.smarthire.dto.auth.VerifyResetOtpRequest;
import com.smarthire.dto.auth.ResetPasswordRequest;

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
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {
        authService.forgotPassword(request);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<String> verifyResetOtp(
            @RequestBody VerifyResetOtpRequest request
    ) {
        authService.verifyResetOtp(request);
        return ResponseEntity.ok("OTP verified successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password reset successful");
    }
}