package com.smarthire.service;

import com.smarthire.dto.AdminResponse;
import com.smarthire.entity.Recruiter;
import com.smarthire.entity.Student;
import com.smarthire.entity.User;

import java.util.List;
import java.util.Map;

public interface AdminService {

    // Dashboard
    Map<String, Long> getDashboard();
    
    // Recruiter Requests
    List<?> getPendingRecruiters();
    void approveRecruiter(Long recruiterRequestId);
    void rejectRecruiter(Long recruiterRequestId);
    
    // Students
    List<Student> getAllStudents();
    Student getStudent(Long id);
    Student updateStudent(Long id, Student student);
    void deleteStudent(Long id);

    // Recruiters
    List<Recruiter> getAllRecruiters();
    Recruiter getRecruiter(Long id);
    Recruiter updateRecruiter(Long id, Recruiter recruiter);
    void deleteRecruiter(Long id);

    // Admins
    List<AdminResponse> getAllAdmins();
    User addAdmin(User admin);
    void deleteAdmin(Long id, String loggedInEmail);
   
}