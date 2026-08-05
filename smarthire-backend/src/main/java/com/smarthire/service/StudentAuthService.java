package com.smarthire.service;

import com.smarthire.dto.student.StudentLoginRequest;
import com.smarthire.dto.student.StudentRegistrationRequest;
import org.springframework.web.multipart.MultipartFile;

public interface StudentAuthService {

    String register(StudentRegistrationRequest request, MultipartFile resume);

    String login(StudentLoginRequest request);
}