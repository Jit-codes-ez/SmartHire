package com.smarthire.service.impl;

import com.smarthire.dto.AdminResponse;
import com.smarthire.entity.Recruiter;
import com.smarthire.entity.RecruiterRequest;
import com.smarthire.entity.Student;
import com.smarthire.entity.User;
import com.smarthire.enums.RecruiterRequestStatus;
import com.smarthire.enums.Role;
import com.smarthire.repository.RecruiterRepository;
import com.smarthire.repository.RecruiterRequestRepository;
import com.smarthire.repository.StudentRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.AdminService;
import com.smarthire.service.EmailService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private RecruiterRequestRepository recruiterRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;


    // DASHBOARD
    @Override
    public Map<String, Long> getDashboard() {
        long totalStudents = studentRepository.count();
        long totalRecruiters = recruiterRepository.count();
        long pendingRecruiters =
                recruiterRequestRepository
                        .findAll()
                        .stream()
                        .filter(request ->request.getStatus()== RecruiterRequestStatus.PENDING).count();

        long totalAdmins =
                userRepository
                        .findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() == Role.ADMIN)
                        .count();

        Map<String, Long> dashboard = new HashMap<>();
        dashboard.put("totalStudents", totalStudents);
        dashboard.put("totalRecruiters", totalRecruiters);
        dashboard.put("pendingRecruiters", pendingRecruiters);
        dashboard.put("totalAdmins", totalAdmins);
        return dashboard;
    }

    // PENDING RECRUITER REQUESTS
    @Override
    public List<?> getPendingRecruiters() {
        List<RecruiterRequest> requests =
                recruiterRequestRepository.findAll()
                        .stream()
                        .filter(request ->
                                request.getStatus()
                                        == RecruiterRequestStatus.PENDING)
                        .toList();
        return requests;
    }

    // APPROVE RECRUITER
    @Override
    public void approveRecruiter(Long recruiterRequestId) {
        RecruiterRequest request =
                recruiterRequestRepository
                        .findById(recruiterRequestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter request not found"
                                )
                        );

        if (request.getStatus()
                != RecruiterRequestStatus.PENDING) {
            throw new RuntimeException(
                    "Recruiter request has already been processed"
            );
        }
        
        String adminEmail = getLoggedInAdminEmail();

        // Check whether email already exists in users
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "A user with this email already exists"
            );
        }

        // Create User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(
                request.getPassword()
        );
        user.setRole(Role.RECRUITER);
        user = userRepository.save(user);
        
        // Create Recruiter
        Recruiter recruiter = new Recruiter();
        recruiter.setFullName(request.getFullName());
        recruiter.setMobileNumber(request.getMobileNumber());
        recruiter.setCompanyName(request.getCompanyName());
        recruiter.setDesignation(request.getDesignation());
        recruiter.setCompanyWebsite(request.getCompanyWebsite());
        recruiter.setCity(request.getCity());
        recruiter.setState(request.getState());
        recruiter.setCountry(request.getCountry());
        recruiter.setIndustry(request.getIndustry());
        recruiter.setCompanyRegistrationNumber(request.getCompanyRegistrationNumber());
        recruiter.setUser(user);
        recruiterRepository.save(recruiter);

        // Mark request as APPROVED
        request.setStatus(RecruiterRequestStatus.APPROVED);
        request.setApprovedRejectedBy(adminEmail);
        recruiterRequestRepository.save(request);
        emailService.sendRecruiterApprovalEmail(request.getEmail(), request.getFullName());
    }
    
    // REJECT RECRUITER
    @Override
    public void rejectRecruiter(Long recruiterRequestId) {
        RecruiterRequest request =
                recruiterRequestRepository
                        .findById(recruiterRequestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter request not found"
                                )
                        );

        if (request.getStatus()
                != RecruiterRequestStatus.PENDING) {
            throw new RuntimeException(
                    "Recruiter request has already been processed"
            );
        }
        String adminEmail = getLoggedInAdminEmail();
        request.setStatus(RecruiterRequestStatus.REJECTED);
        request.setApprovedRejectedBy(adminEmail);
        recruiterRequestRepository.save(request);
        emailService.sendRecruiterRejectionEmail(request.getEmail(), request.getFullName());
    }

    // STUDENTS
    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        )
                );
    }
    @Override
    public Student updateStudent(
            Long id,
            Student updatedStudent) {
        Student existingStudent =
                studentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );
        existingStudent.setFullName(updatedStudent.getFullName());
        existingStudent.setMobileNumber(updatedStudent.getMobileNumber());
        existingStudent.setCourse(updatedStudent.getCourse());
        existingStudent.setBranch(updatedStudent.getBranch());
        existingStudent.setPassingYear(updatedStudent.getPassingYear());
        existingStudent.setCgpa(updatedStudent.getCgpa());
        existingStudent.setSkills(updatedStudent.getSkills());
        existingStudent.setLinkedinUrl(updatedStudent.getLinkedinUrl());
        existingStudent.setResumeUrl(updatedStudent.getResumeUrl());
        return studentRepository.save(existingStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student =
                studentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"));
        User user = student.getUser();
        studentRepository.delete(student);
        if (user != null) {
            userRepository.delete(user);
        }
    }

    // RECRUITERS
    @Override
    public List<Recruiter> getAllRecruiters() {
        return recruiterRepository.findAll();
    }

    @Override
    public Recruiter getRecruiter(Long id) {
        return recruiterRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Recruiter not found"
                        )
                );
    }

    @Override
    public Recruiter updateRecruiter(
            Long id,
            Recruiter updatedRecruiter) {
        Recruiter existingRecruiter =
                recruiterRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter not found"
                                )
                        );

        existingRecruiter.setFullName(updatedRecruiter.getFullName());
        existingRecruiter.setMobileNumber(updatedRecruiter.getMobileNumber());
        existingRecruiter.setCompanyName(updatedRecruiter.getCompanyName());
        existingRecruiter.setDesignation(updatedRecruiter.getDesignation());
        existingRecruiter.setCompanyWebsite(updatedRecruiter.getCompanyWebsite());
        existingRecruiter.setCity(updatedRecruiter.getCity());
        existingRecruiter.setState(updatedRecruiter.getState());
        existingRecruiter.setCountry(updatedRecruiter.getCountry());
        existingRecruiter.setIndustry(updatedRecruiter.getIndustry());
        existingRecruiter.setCompanyRegistrationNumber(updatedRecruiter.getCompanyRegistrationNumber());
        return recruiterRepository.save(existingRecruiter);
    }

    @Override
    public void deleteRecruiter(Long id) {
        Recruiter recruiter =
                recruiterRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter not found"
                                )
                        );
        User user = recruiter.getUser();
        recruiterRepository.delete(recruiter);
        if (user != null) {
            userRepository.delete(user);
        }
    }
    
    // ADMINS
    @Override
    public List<AdminResponse> getAllAdmins() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.ADMIN)
                .map(user -> new AdminResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }
    @Override
    public User addAdmin(User admin) {
        if (admin.getEmail() == null ||
                admin.getEmail().trim().isEmpty()) {
            throw new RuntimeException(
                    "Admin email is required"
            );
        }
        if (userRepository.existsByEmail(admin.getEmail())) {

            throw new RuntimeException(
                    "A user with this email already exists"
            );
        }

        User newAdmin = new User();
        newAdmin.setEmail(
                admin.getEmail()
        );
        newAdmin.setPassword(
                passwordEncoder.encode(
                        admin.getPassword()
                )
        );
        newAdmin.setRole(
                Role.ADMIN
        );
        return userRepository.save(newAdmin);
    }

    @Override
    public void deleteAdmin(Long id) {
        User admin =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admin not found"
                                )
                        );
        if (admin.getRole() != Role.ADMIN) {

            throw new RuntimeException(
                    "User is not an admin"
            );
        }
        userRepository.delete(admin);
    }
    
    private String getLoggedInAdminEmail() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Admin is not authenticated");
        }

        return authentication.getName();
    }
}