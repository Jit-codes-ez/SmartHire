package com.smarthire.repository;

import com.smarthire.entity.Job;
import com.smarthire.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiter(Recruiter recruiter);
}