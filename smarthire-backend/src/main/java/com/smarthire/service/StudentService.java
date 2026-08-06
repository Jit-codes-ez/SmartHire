package com.smarthire.service;

import com.smarthire.dto.student.StudentRegistrationRequest;
import com.smarthire.dto.student.StudentRegistrationResponse;

public interface StudentService 
{
	StudentRegistrationResponse registerStudent(StudentRegistrationRequest request);

}