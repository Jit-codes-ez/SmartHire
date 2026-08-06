package com.smarthire.service;

import com.smarthire.dto.student.StudentRegistrationRequest;
import com.smarthire.dto.student.StudentRegistrationResponse;
import com.smarthire.entity.Student;

public interface StudentService {

    // Register Student
    StudentRegistrationResponse registerStudent(StudentRegistrationRequest request);

    // Get Student Profile using Email
    Student getStudentByEmail(String email);
    Student updateProfile(String email, Student student);

}