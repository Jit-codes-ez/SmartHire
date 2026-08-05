package com.smarthire.service;

import com.smarthire.dto.student.StudentLoginRequest;
import com.smarthire.dto.student.StudentLoginResponse;
import com.smarthire.dto.student.StudentRegistrationRequest;
import com.smarthire.dto.student.StudentRegistrationResponse;

public interface StudentService 
{
	StudentRegistrationResponse registerStudent(StudentRegistrationRequest request) throws Exception;
    StudentLoginResponse loginStudent(StudentLoginRequest request);
    void logoutStudent(String token);

}