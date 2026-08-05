package com.smarthire.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smarthire.dto.student.StudentLoginRequest;
import com.smarthire.dto.student.StudentLoginResponse;
import com.smarthire.dto.student.StudentRegistrationRequest;
import com.smarthire.dto.student.StudentRegistrationResponse;
import com.smarthire.entity.Student;
import com.smarthire.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.smarthire.enums.Role;
import com.smarthire.exception.EmailAlreadyExistsException;
import com.smarthire.repository.StudentRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.CloudinaryService;
import com.smarthire.service.StudentService;



@Service
public class StudentServiceIMPL implements StudentService {
	
	@Autowired
	UserRepository urepo;
	@Autowired
	StudentRepository srepo;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private CloudinaryService cloudinaryService;
	
	@Override
	public StudentRegistrationResponse registerStudent(StudentRegistrationRequest request) throws Exception {
	    // Check if email already exists
	    if (urepo.existsByEmail(request.getEmail())) {
	        throw new EmailAlreadyExistsException("Email already exists.");
	    }

	    // Create User
	    User user = new User();
	    user.setEmail(request.getEmail());
	    user.setPassword(passwordEncoder.encode(request.getPassword()));
	    user.setRole(Role.STUDENT);

	    // Save User
	    User savedUser = urepo.save(user);

	    // Create Student
	    Student student = new Student();
	    student.setFullName(request.getFullName());
	    student.setMobileNumber(request.getMobileNumber());
	    student.setCourse(request.getCourse());
	    student.setBranch(request.getBranch());
	    student.setPassingYear(request.getPassingYear());
	    student.setCgpa(request.getCgpa());
	    student.setSkills(request.getSkills());
	    student.setLinkedinUrl(request.getLinkedinUrl());
	    
	 // Saving Resume.pdf in Cloudinary Cloud Server
	    String resumeUrl = cloudinaryService.upload(request.getResume());
	    student.setResumeUrl(resumeUrl);

	    // Link Student with User
	    student.setUser(savedUser);

	    // Save Student
	    Student savedStudent = srepo.save(student);

	 // Prepare Response
	    StudentRegistrationResponse response = new StudentRegistrationResponse();
	    response.setStudentId(savedStudent.getId());
	    response.setEmail(savedUser.getEmail());
	    response.setRole(savedUser.getRole());
	    response.setMessage("Student registered successfully.");
	    return response;
	}
	
	@Override
	public StudentLoginResponse loginStudent(StudentLoginRequest request) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void logoutStudent(String token) {
		// TODO Auto-generated method stub

	}

}
