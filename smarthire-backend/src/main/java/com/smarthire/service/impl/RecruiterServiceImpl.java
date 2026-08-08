package com.smarthire.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smarthire.dto.recruiter.RecruiterRegistrationRequest;
import com.smarthire.dto.recruiter.RecruiterRegistrationResponse;
import com.smarthire.entity.RecruiterRequest;
import com.smarthire.enums.OtpPurpose;
import com.smarthire.exception.EmailAlreadyExistsException;
import com.smarthire.exception.EmailNotVerifiedException;
import com.smarthire.repository.RecruiterRequestRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.OtpService;
import com.smarthire.service.RecruiterService;
import com.smarthire.dto.recruiter.RecruiterProfileResponse;
import com.smarthire.entity.Recruiter;
import com.smarthire.entity.User;
import com.smarthire.repository.RecruiterRepository;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    @Autowired
    private RecruiterRequestRepository recruiterRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpService otpService;
    @Autowired
    private RecruiterRepository recruiterRepository;

    @Override
    public RecruiterRegistrationResponse registerRecruiter(RecruiterRegistrationRequest request) {

        // Check if recruiter already exists
        if (userRepository.existsByEmail(request.getEmail())
                || recruiterRequestRepository.existsByEmail(request.getEmail())) {

            throw new EmailAlreadyExistsException("Email already exists.");
        }

        // Block registration unless the email was OTP-verified first
        if (!otpService.isEmailVerified(request.getEmail(), OtpPurpose.REGISTRATION)) {
            throw new EmailNotVerifiedException("Please verify your email before registering.");
        }

        RecruiterRequest recruiter = new RecruiterRequest();

        recruiter.setFullName(request.getFullName());
        recruiter.setEmail(request.getEmail());

        // Store encoded password
        recruiter.setPassword(passwordEncoder.encode(request.getPassword()));

        recruiter.setMobileNumber(request.getMobileNumber());
        recruiter.setCompanyName(request.getCompanyName());
        recruiter.setDesignation(request.getDesignation());
        recruiter.setCompanyWebsite(request.getCompanyWebsite());
        recruiter.setCity(request.getCity());
        recruiter.setState(request.getState());
        recruiter.setCountry(request.getCountry());
        recruiter.setIndustry(request.getIndustry());
        recruiter.setCompanyRegistrationNumber(request.getCompanyRegistrationNumber());

        RecruiterRequest savedRecruiter =
                recruiterRequestRepository.save(recruiter);

        RecruiterRegistrationResponse response =
                new RecruiterRegistrationResponse();

        response.setRequestId(savedRecruiter.getId());
        response.setEmail(savedRecruiter.getEmail());
        response.setMessage(
                "Registration submitted successfully. Please wait for admin approval.");

        return response;
    }
    @Override
    public RecruiterProfileResponse getRecruiterProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter user not found")
                );

        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter profile not found")
                );

        RecruiterProfileResponse response =
                new RecruiterProfileResponse();

        response.setId(recruiter.getId());
        response.setFullName(recruiter.getFullName());
        response.setEmail(user.getEmail());
        response.setMobileNumber(recruiter.getMobileNumber());
        response.setCompanyName(recruiter.getCompanyName());
        response.setDesignation(recruiter.getDesignation());
        response.setCompanyWebsite(recruiter.getCompanyWebsite());
        response.setCity(recruiter.getCity());
        response.setState(recruiter.getState());
        response.setCountry(recruiter.getCountry());
        response.setIndustry(recruiter.getIndustry());
        response.setCompanyRegistrationNumber(
                recruiter.getCompanyRegistrationNumber()
        );

        return response;
    }
    @Override
    public RecruiterProfileResponse updateRecruiterProfile(
            String email,
            RecruiterProfileResponse request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter user not found")
                );

        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter profile not found")
                );

        recruiter.setFullName(request.getFullName());
        recruiter.setMobileNumber(request.getMobileNumber());
        recruiter.setCompanyName(request.getCompanyName());
        recruiter.setDesignation(request.getDesignation());
        recruiter.setCompanyWebsite(request.getCompanyWebsite());
        recruiter.setCity(request.getCity());
        recruiter.setState(request.getState());
        recruiter.setCountry(request.getCountry());
        recruiter.setIndustry(request.getIndustry());
        recruiter.setCompanyRegistrationNumber(
                request.getCompanyRegistrationNumber()
        );

        Recruiter updatedRecruiter =
                recruiterRepository.save(recruiter);

        RecruiterProfileResponse response =
                new RecruiterProfileResponse();

        response.setId(updatedRecruiter.getId());
        response.setFullName(updatedRecruiter.getFullName());
        response.setEmail(user.getEmail());
        response.setMobileNumber(updatedRecruiter.getMobileNumber());
        response.setCompanyName(updatedRecruiter.getCompanyName());
        response.setDesignation(updatedRecruiter.getDesignation());
        response.setCompanyWebsite(updatedRecruiter.getCompanyWebsite());
        response.setCity(updatedRecruiter.getCity());
        response.setState(updatedRecruiter.getState());
        response.setCountry(updatedRecruiter.getCountry());
        response.setIndustry(updatedRecruiter.getIndustry());
        response.setCompanyRegistrationNumber(
                updatedRecruiter.getCompanyRegistrationNumber()
        );

        return response;
    }
}