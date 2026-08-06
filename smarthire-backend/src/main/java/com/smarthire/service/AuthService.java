package com.smarthire.service;

import com.smarthire.dto.auth.LoginRequest;
import com.smarthire.dto.auth.LoginResponse;
import com.smarthire.dto.auth.SendOtpRequest;
import com.smarthire.dto.auth.VerifyOtpRequest;
import com.smarthire.dto.auth.VerifyOtpResponse;
import com.smarthire.dto.otp.LoginOtpResponse;
import com.smarthire.dto.otp.LoginOtpVerifyRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void sendOtp(SendOtpRequest request);

    void sendRegistrationOtp(SendOtpRequest request);
    VerifyOtpResponse verifyOtp(VerifyOtpRequest request);

    // New — used by OtpController's /login/verify-otp, issues the JWT after OTP success
    LoginOtpResponse verifyLoginOtp(LoginOtpVerifyRequest request);

    void logout(String token);
}