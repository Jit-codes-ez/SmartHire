package com.smarthire.service;

import com.smarthire.dto.auth.LoginRequest;
import com.smarthire.dto.auth.LoginResponse;
import com.smarthire.dto.otp.LoginOtpResponse;
import com.smarthire.dto.otp.LoginOtpVerifyRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);

    // Used by OtpController's /login/verify-otp, issues the JWT after OTP success
    LoginOtpResponse verifyLoginOtp(LoginOtpVerifyRequest request);

    void logout(String token);
}