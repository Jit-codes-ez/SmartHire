package com.smarthire.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smarthire.dto.auth.LoginRequest;
import com.smarthire.dto.auth.LoginResponse;
import com.smarthire.dto.auth.SendOtpRequest;
import com.smarthire.dto.auth.VerifyOtpRequest;
import com.smarthire.dto.auth.VerifyOtpResponse;
import com.smarthire.entity.User;
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
        otpService.generateAndSendOtp(request.getEmail());
    }


    @Override
    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {

        // This will throw InvalidOtpException if OTP is wrong
        otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
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


    @Override
    public void logout(String token) {

        // JWT is stateless.
        // Remove token from frontend.
        // No database operation required.

    }
}