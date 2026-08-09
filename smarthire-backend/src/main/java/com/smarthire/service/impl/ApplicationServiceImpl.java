package com.smarthire.service.impl;

import com.smarthire.dto.job_application.JobApplicationResponse;
import com.smarthire.entity.Application;
import com.smarthire.entity.Job;
import com.smarthire.entity.Student;
import com.smarthire.entity.User;
import com.smarthire.enums.ApplicationStatus;
import com.smarthire.enums.JobStatus;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.StudentRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.ApplicationService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationServiceImpl
        implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;


    public ApplicationServiceImpl(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            StudentRepository studentRepository) {

        this.applicationRepository =
                applicationRepository;

        this.jobRepository =
                jobRepository;

        this.userRepository =
                userRepository;

        this.studentRepository =
                studentRepository;
    }


    @Override
    public Application applyForJob(
            String email,
            Long jobId) {

        // -----------------------------------------
        // Find user
        // -----------------------------------------

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );


        // -----------------------------------------
        // Find student
        // -----------------------------------------

        Student student = studentRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student profile not found"
                        )
                );


        // -----------------------------------------
        // Find job
        // -----------------------------------------

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );


        // -----------------------------------------
        // Check job status
        // -----------------------------------------

        if (job.getStatus() != JobStatus.ACTIVE) {

            throw new RuntimeException(
                    "This job is no longer accepting applications"
            );
        }


        // -----------------------------------------
        // Check duplicate application
        // -----------------------------------------

        if (applicationRepository
                .existsByStudentAndJob(student, job)) {

            throw new RuntimeException(
                    "You have already applied for this job"
            );
        }


        // -----------------------------------------
        // Create application
        // -----------------------------------------

        Application application =
                new Application();

        application.setStudent(student);
        application.setJob(job);

        application.setStatus(
                ApplicationStatus.APPLIED
        );

        application.setAppliedAt(
                LocalDateTime.now()
        );


        // -----------------------------------------
        // Save
        // -----------------------------------------

        return applicationRepository.save(
                application
        );
    }


    @Override
    public boolean hasApplied(
            String email,
            Long jobId) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        Student student = studentRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student profile not found"
                        )
                );

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        return applicationRepository
                .existsByStudentAndJob(
                        student,
                        job
                );
    }


    @Override
    public List<JobApplicationResponse> getMyApplications(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Student profile not found"));

        List<Application> applications =
                applicationRepository.findByStudent(student);

        return applications.stream()
                .map(application -> {

                    Job job = application.getJob();

                    String companyName = "Company";

                    if (job.getRecruiter() != null) {
                        companyName =
                                job.getRecruiter().getCompanyName();
                    }

                    return new JobApplicationResponse(
                            application.getId(),
                            job.getId(),
                            job.getTitle(),
                            companyName,
                            job.getLocation(),
                            job.getEmploymentType(),
                            job.getSalary(),
                            application.getStatus().name(),
                            application.getAppliedAt()
                    );
                })
                .toList();
    }
}