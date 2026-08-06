package com.smarthire.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarthire.entity.RecruiterRequest;

public interface RecruiterRequestRepository extends JpaRepository<RecruiterRequest, Long> {

    boolean existsByEmail(String email);

    Optional<RecruiterRequest> findByEmail(String email);

}