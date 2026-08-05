package com.smarthire.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smarthire.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

}
