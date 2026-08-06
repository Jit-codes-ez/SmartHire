package com.smarthire.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarthire.entity.Student;
import com.smarthire.entity.User;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByMobileNumber(String mobileNumber);

    Optional<Student> findByUser(User user);

    // Find student using the email stored in the User table
    Optional<Student> findByUserEmail(String email);
    
}