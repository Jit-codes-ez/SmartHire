package com.smarthire.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smarthire.dto.auth.LoginRequest;
import com.smarthire.dto.auth.LoginResponse;
import com.smarthire.dto.auth.SendOtpRequest;
import com.smarthire.dto.auth.VerifyOtpRequest;
import com.smarthire.dto.auth.VerifyOtpResponse;
import com.smarthire.dto.otp.LoginOtpResponse;
import com.smarthire.dto.otp.LoginOtpVerifyRequest;
import com.smarthire.entity.User;
import com.smarthire.enums.OtpPurpose;
import com.smarthire.exception.InvalidCredentialsException;
import com.smarthire.repository.UserRepository;
import com.smarthire.security.JwtService;
import com.smarthire.service.AuthService;
import com.smarthire.service.OtpService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpService otpService;

    @Autowired
    private JwtService jwtService;


    @Override
    public LoginResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                    new InvalidCredentialsException("Invalid email or password")
                );


        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new InvalidCredentialsException("Invalid email or password");
        }


        // Generate JWT Token
        String token = jwtService.generateToken(user);


        // Return response
        return new LoginResponse(
                "Login successful",
                token,
                user.getEmail(),
                user.getRole()
        );
    }


    @Override
    public void sendOtp(SendOtpRequest request) {

        // Check if user exists
        userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                    new InvalidCredentialsException("User not found")
                );


        // Generate and send OTP
        otpService.generateAndSendOtp(request.getEmail(), OtpPurpose.LOGIN);
    }

    @Override
    public void sendRegistrationOtp(SendOtpRequest request) {

        otpService.generateAndSendOtp(request.getEmail(), OtpPurpose.REGISTRATION);

    }


    @Override
    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {

        // This will throw InvalidOtpException if OTP is wrong
        otpService.verifyOtp(
                request.getEmail(),
                request.getOtp(),
                OtpPurpose.LOGIN
        );


        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("User not found")
                );


        String token = jwtService.generateToken(user);


        return new VerifyOtpResponse(
                "OTP verified successfully",
                token,
                user.getEmail(),
                user.getRole()
        );
    }


    // New — called by OtpController's /login/verify-otp
    @Override
    public LoginOtpResponse verifyLoginOtp(LoginOtpVerifyRequest request) {

        // Throws InvalidOtpException if wrong/expired
        otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpPurpose.LOGIN);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        String token = jwtService.generateToken(user);

        return new LoginOtpResponse(
                "OTP verified successfully",
                user.getEmail(),
                token,
                user.getRole().toString()
        );
    }


    @Override
    public void logout(String token) {

        // JWT is stateless.
        // Remove token from frontend.
        // No database operation required.

    }
}