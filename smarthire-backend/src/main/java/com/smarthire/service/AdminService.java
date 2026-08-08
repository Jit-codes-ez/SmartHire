package com.smarthire.service;

import com.smarthire.dto.AdminResponse;
import com.smarthire.dto.RecruiterResponse;
import com.smarthire.dto.StudentResponse;
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
    List<StudentResponse> getAllStudents();
    Student getStudent(Long id);
    void deleteStudent(Long id, String reason);

 // Recruiters
    List<RecruiterResponse> getAllRecruiters();
    Recruiter getRecruiter(Long id);
    void deleteRecruiter(Long id, String reason);

    // Admins
    List<AdminResponse> getAllAdmins();
    User addAdmin(User admin);
    void deleteAdmin(Long id, String loggedInEmail);
   
}