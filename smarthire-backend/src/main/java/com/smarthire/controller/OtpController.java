package com.smarthire.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smarthire.dto.otp.LoginOtpRequest;
import com.smarthire.dto.otp.LoginOtpResponse;
import com.smarthire.dto.otp.LoginOtpVerifyRequest;
import com.smarthire.dto.otp.RegistrationOtpRequest;
import com.smarthire.dto.otp.RegistrationOtpResponse;
import com.smarthire.dto.otp.RegistrationOtpVerifyRequest;
import com.smarthire.enums.OtpPurpose;
import com.smarthire.exception.EmailAlreadyExistsException;
import com.smarthire.repository.RecruiterRequestRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.AuthService;
import com.smarthire.service.OtpService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecruiterRequestRepository recruiterRequestRepository;

    // ---------- LOGIN OTP ----------

    @PostMapping("/login/send-otp")
    public LoginOtpResponse sendLoginOtp(@RequestBody LoginOtpRequest request) {
        otpService.generateAndSendOtp(request.getEmail(), OtpPurpose.LOGIN);
        return new LoginOtpResponse("OTP sent successfully", request.getEmail());
    }

    @PostMapping("/login/verify-otp")
    public LoginOtpResponse verifyLoginOtp(@RequestBody LoginOtpVerifyRequest request) {
        return authService.verifyLoginOtp(request);
    }

    // ---------- REGISTRATION OTP ----------

    @PostMapping("/register/send-otp")
    public RegistrationOtpResponse sendRegistrationOtp(@RequestBody RegistrationOtpRequest request) {

        // Block if the email is already a user OR already has a recruiter request
        if (userRepository.existsByEmail(request.getEmail())
                || recruiterRequestRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists.");
        }

        otpService.generateAndSendOtp(request.getEmail(), OtpPurpose.REGISTRATION);
        return new RegistrationOtpResponse("OTP sent successfully", request.getEmail());
    }

    @PostMapping("/register/verify-otp")
    public RegistrationOtpResponse verifyRegistrationOtp(@RequestBody RegistrationOtpVerifyRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpPurpose.REGISTRATION);
        return new RegistrationOtpResponse("OTP verified successfully", request.getEmail());
    }
}