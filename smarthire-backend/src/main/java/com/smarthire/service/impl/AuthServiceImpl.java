package com.smarthire.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smarthire.dto.auth.LoginRequest;
import com.smarthire.dto.auth.LoginResponse;
import com.smarthire.dto.otp.LoginOtpResponse;
import com.smarthire.dto.otp.LoginOtpVerifyRequest;
import com.smarthire.entity.User;
import com.smarthire.enums.OtpPurpose;
import com.smarthire.exception.InvalidCredentialsException;
import com.smarthire.repository.UserRepository;
import com.smarthire.security.JwtService;
import com.smarthire.service.AuthService;
import com.smarthire.service.OtpService;
import com.smarthire.dto.auth.ForgotPasswordRequest;
import com.smarthire.dto.auth.ResetPasswordRequest;
import com.smarthire.dto.auth.VerifyResetOtpRequest;

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

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                    new InvalidCredentialsException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                "Login successful",
                token,
                user.getEmail(),
                user.getRole()
        );
    }


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
    @Override
    public void forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Email not registered"));

        otpService.generateAndSendOtp(
                user.getEmail(),
                OtpPurpose.RESET_PASSWORD
        );
    }
    @Override
    public void verifyResetOtp(VerifyResetOtpRequest request) {

        otpService.verifyOtp(
                request.getEmail(),
                request.getOtp(),
                OtpPurpose.RESET_PASSWORD
        );
    }
    @Override
    public void resetPassword(ResetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("User not found"));

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }
}