package com.smarthire.service;

import com.smarthire.dto.auth.LoginRequest;
import com.smarthire.dto.auth.LoginResponse;
import com.smarthire.dto.auth.SendOtpRequest;
import com.smarthire.dto.auth.VerifyOtpRequest;
import com.smarthire.dto.auth.VerifyOtpResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    void sendOtp(SendOtpRequest request);
    
    void sendRegistrationOtp(SendOtpRequest request);

    VerifyOtpResponse verifyOtp(VerifyOtpRequest request);

    void logout(String token);
}