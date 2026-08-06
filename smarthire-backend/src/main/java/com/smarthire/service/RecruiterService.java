package com.smarthire.service;

import com.smarthire.dto.recruiter.RecruiterRegistrationRequest;
import com.smarthire.dto.recruiter.RecruiterRegistrationResponse;

public interface RecruiterService {

    RecruiterRegistrationResponse registerRecruiter(RecruiterRegistrationRequest request);

}