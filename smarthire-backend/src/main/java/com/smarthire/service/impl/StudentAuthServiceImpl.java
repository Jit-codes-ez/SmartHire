package com.smarthire.service.impl;

import com.smarthire.dto.student.StudentLoginRequest;
import com.smarthire.dto.student.StudentRegistrationRequest;
import com.smarthire.entity.Student;
import com.smarthire.entity.User;
import com.smarthire.enums.Role;
import com.smarthire.repository.StudentRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.StudentAuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StudentAuthServiceImpl implements StudentAuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentAuthServiceImpl(UserRepository userRepository,
                                  StudentRepository studentRepository,
                                  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String register(StudentRegistrationRequest request, MultipartFile resume) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        // Create User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);

        userRepository.save(user);

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

        // TODO: Replace this after Cloudinary upload
        student.setResumeUrl("resume.pdf");

        student.setUser(user);

        studentRepository.save(student);

        return "Student Registered Successfully";
    }

    @Override
    public String login(StudentLoginRequest request) {
        return "Student Login Successful";
    }
}