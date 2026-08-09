package com.smarthire.repository;

import com.smarthire.entity.Application;
import com.smarthire.entity.Job;
import com.smarthire.entity.Student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    boolean existsByStudentAndJob(
            Student student,
            Job job
    );

    Optional<Application> findByStudentAndJob(
            Student student,
            Job job
    );

    List<Application> findByStudent(
            Student student
    );

    List<Application> findByJob(
            Job job
    );
}