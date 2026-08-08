package com.smarthire.service.impl;

import com.smarthire.dto.AdminResponse;
import com.smarthire.dto.RecruiterResponse;
import com.smarthire.dto.StudentResponse;
import com.smarthire.entity.Recruiter;
import com.smarthire.entity.RecruiterRequest;
import com.smarthire.entity.Student;
import com.smarthire.entity.User;
import com.smarthire.enums.RecruiterRequestStatus;
import com.smarthire.enums.Role;
import com.smarthire.exception.EmailAlreadyExistsException;
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
            throw new EmailAlreadyExistsException("A user with this email already exists");
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
        emailService.sendRecruiterRejectionEmail(request.getEmail(), request.getFullName(), adminEmail);
    }

    // STUDENTS
    @Override
    public List<StudentResponse> getAllStudents() {
    	return studentRepository.findAll()
                .stream()
                .map(student -> new StudentResponse(
                        student.getId(),
                        student.getFullName(),
                        student.getUser().getEmail(),
                        student.getMobileNumber(),
                        student.getCourse(),
                        student.getBranch(),
                        student.getPassingYear(),
                        student.getCgpa(),
                        student.getSkills(),
                        student.getLinkedinUrl(),
                        student.getResumeUrl()
                ))
                .toList();
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
    public void deleteStudent(Long id, String reason) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException("Deletion reason is required");
        }

        User user = student.getUser();
        String email = user != null ? user.getEmail() : null;
        String fullName = student.getFullName();

        if (email != null) {
            emailService.sendStudentDeletionEmail(email, fullName, reason.trim());
        }

        studentRepository.delete(student);

        if (user != null) {
            userRepository.delete(user);
        }
    }

    // RECRUITERS
    @Override
    public List<RecruiterResponse> getAllRecruiters() {

        return recruiterRepository.findAll()
                .stream()
                .map(recruiter -> new RecruiterResponse(
                        recruiter.getId(),
                        recruiter.getFullName(),
                        recruiter.getUser().getEmail(),
                        recruiter.getMobileNumber(),
                        recruiter.getCompanyName(),
                        recruiter.getDesignation(),
                        recruiter.getCompanyWebsite(),
                        recruiter.getCity(),
                        recruiter.getState(),
                        recruiter.getCountry(),
                        recruiter.getIndustry(),
                        recruiter.getCompanyRegistrationNumber()
                ))
                .toList();
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
    public void deleteRecruiter(Long id, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException("Reason for deletion is required");
        }
        Recruiter recruiter = recruiterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        User user = recruiter.getUser();
        if (user == null) {
            throw new RuntimeException("Recruiter account is not linked to a user");
        }
        String email = user.getEmail();
        String fullName = recruiter.getFullName();
        emailService.sendRecruiterDeletionEmail(email, fullName, reason.trim());
        recruiterRequestRepository.findByEmail(email).ifPresent(recruiterRequestRepository::delete);
        recruiterRepository.delete(recruiter);
        userRepository.delete(user);
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
            throw new RuntimeException("Admin email is required");
        }
        if (userRepository.existsByEmail(admin.getEmail())) {
            throw new EmailAlreadyExistsException("A user with this email already exists");
        }
        User newAdmin = new User();
        newAdmin.setEmail(admin.getEmail().trim());
        newAdmin.setPassword(passwordEncoder.encode(admin.getPassword()));

        // Never trust the role sent by the frontend
        newAdmin.setRole(Role.ADMIN);
        return userRepository.save(newAdmin);
    }

    @Override
    public void deleteAdmin(Long id, String loggedInEmail) {
        User admin = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("User is not an admin");
        }
        if (admin.getEmail().equalsIgnoreCase(loggedInEmail)) {
            throw new RuntimeException("You cannot delete the administrator account you are currently logged in with");
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