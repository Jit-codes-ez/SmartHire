package com.smarthire.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smarthire.dto.recruiter.RecruiterRegistrationRequest;
import com.smarthire.dto.recruiter.RecruiterRegistrationResponse;
import com.smarthire.entity.RecruiterRequest;
import com.smarthire.exception.EmailAlreadyExistsException;
import com.smarthire.repository.RecruiterRequestRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.RecruiterService;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    @Autowired
    private RecruiterRequestRepository recruiterRequestRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public RecruiterRegistrationResponse registerRecruiter(RecruiterRegistrationRequest request) {

        // Check if recruiter already exists
        if (userRepository.existsByEmail(request.getEmail())
                || recruiterRequestRepository.existsByEmail(request.getEmail())) {

            throw new EmailAlreadyExistsException("Email already exists.");
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
}