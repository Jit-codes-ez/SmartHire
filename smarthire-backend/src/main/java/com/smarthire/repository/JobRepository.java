package com.smarthire.repository;

import com.smarthire.entity.Job;
import com.smarthire.entity.Recruiter;
import com.smarthire.enums.JobStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository
        extends JpaRepository<Job, Long> {

    List<Job> findByRecruiter(
            Recruiter recruiter
    );

    List<Job> findByStatus(
            JobStatus status
    );
}