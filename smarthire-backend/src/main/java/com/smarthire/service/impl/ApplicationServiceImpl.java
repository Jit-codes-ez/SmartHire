package com.smarthire.service.impl;

import com.smarthire.dto.job_application.JobApplicationResponse;
import com.smarthire.dto.recruiter.RecruiterApplicantResponse;
import com.smarthire.entity.Application;
import com.smarthire.entity.Job;
import com.smarthire.entity.Student;
import com.smarthire.entity.User;
import com.smarthire.enums.ApplicationStatus;
import com.smarthire.enums.InterviewType;
import com.smarthire.enums.JobStatus;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.StudentRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.ApplicationService;
import com.smarthire.service.EmailService;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final EmailService emailService;

    public ApplicationServiceImpl(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            StudentRepository studentRepository,
            EmailService emailService) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.emailService = emailService;
    }

    // APPLY FOR JOB
    @Override
    public Application applyForJob(
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

        if (job.getStatus() != JobStatus.ACTIVE) {

            throw new RuntimeException(
                    "This job is no longer accepting applications"
            );
        }

        if (applicationRepository
                .existsByStudentAndJob(student, job)) {

            throw new RuntimeException(
                    "You have already applied for this job"
            );
        }

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

        return applicationRepository.save(
                application
        );
    }

    // CHECK WHETHER STUDENT APPLIED
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

    // GET MY APPLICATIONS
    @Override
    public List<JobApplicationResponse> getMyApplications(
            String email) {

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

        List<Application> applications =
                applicationRepository.findByStudent(student);

        return applications.stream()
                .map(application -> {

                    Job job =
                            application.getJob();

                    String companyName =
                            "Company";

                    if (job.getRecruiter() != null) {

                        companyName =
                                job.getRecruiter()
                                        .getCompanyName();
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

    // GET APPLICANTS BY JOB
    @Override
    public List<RecruiterApplicantResponse> getApplicantsByJob(
            Long jobId) {

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        List<Application> applications =
                applicationRepository.findByJob(job);

        return applications.stream()
                .map(application -> {

                    Student student =
                            application.getStudent();

                    String email = "";

                    if (student.getUser() != null) {

                        email =
                                student.getUser()
                                        .getEmail();
                    }

                    return new RecruiterApplicantResponse(
                            application.getId(),
                            student.getId(),
                            student.getFullName(),
                            email,
                            student.getMobileNumber(),
                            student.getSkills(),
                            student.getBranch() != null
                                    ? student.getBranch().name()
                                    : null,
                            student.getCgpa(),
                            student.getResumeUrl(),
                            application.getStatus().name(),
                            application.getAppliedAt()
                    );
                })
                .toList();
    }

    // SHORTLIST APPLICATION
    @Override
    public Application shortlistApplication(
            Long applicationId,
            LocalDate interviewDate,
            LocalTime interviewTime,
            InterviewType interviewType,
            String interviewLocation) {

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        // Validate current status
        if (application.getStatus()
                == ApplicationStatus.SELECTED) {

            throw new RuntimeException(
                    "Approved application cannot be shortlisted"
            );
        }

        if (application.getStatus()
                == ApplicationStatus.REJECTED) {

            throw new RuntimeException(
                    "Rejected application cannot be shortlisted"
            );
        }

        // Validate interview date
        if (interviewDate == null) {

            throw new RuntimeException(
                    "Interview date is required"
            );
        }

        // Validate interview time
        if (interviewTime == null) {

            throw new RuntimeException(
                    "Interview time is required"
            );
        }

        // Validate interview type
        if (interviewType == null) {

            throw new RuntimeException(
                    "Interview type is required"
            );
        }

        // Validate location
        if (interviewLocation == null
                || interviewLocation.trim().isEmpty()) {

            throw new RuntimeException(
                    "Interview location is required"
            );
        }

        // Update
        application.setStatus(
                ApplicationStatus.SHORTLISTED
        );

        application.setInterviewDate(
                interviewDate
        );

        application.setInterviewTime(
                interviewTime
        );
        
        application.setInterviewType(
                interviewType
        );

        application.setInterviewLocation(
                interviewLocation.trim()
        );

        // Save
        Application savedApplication =
                applicationRepository.save(application);

        Student student =
                application.getStudent();

        User user =
                student.getUser();

        if (user != null && user.getEmail() != null) {

            Job job = application.getJob();

            emailService.sendStudentShortlistEmail(
                    user.getEmail(),
                    student.getFullName(),
                    job.getTitle(),
                    interviewDate,
                    interviewTime,
                    interviewType,
                    interviewLocation.trim()
            );
        }
        return savedApplication;
    }

 // APPROVE APPLICATION
    @Override
    public Application approveApplication(
            Long applicationId,
            LocalDate joiningDate) {

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        // Validate current status
        if (application.getStatus()
                == ApplicationStatus.SELECTED) {

            throw new RuntimeException(
                    "Application is already approved"
            );
        }

        if (application.getStatus()
                == ApplicationStatus.REJECTED) {

            throw new RuntimeException(
                    "Rejected application cannot be approved"
            );
        }

        // Validate joining date
        if (joiningDate == null) {

            throw new RuntimeException(
                    "Joining date is required"
            );
        }

        // Update application
        application.setStatus(
                ApplicationStatus.SELECTED
        );

        application.setJoiningDate(
                joiningDate
        );

        // Save application
        Application savedApplication =
                applicationRepository.save(application);

        // Send approval email
        Student student =
                application.getStudent();

        User user =
                student.getUser();

        if (user != null
                && user.getEmail() != null) {

            Job job =
                    application.getJob();

            emailService.sendStudentApprovalEmail(
                    user.getEmail(),
                    student.getFullName(),
                    job.getTitle(),
                    joiningDate
            );
        }

        return savedApplication;
    }

 // REJECT APPLICATION
    @Override
    public Application rejectApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Validate current status
        if (application.getStatus() == ApplicationStatus.SELECTED) {
            throw new RuntimeException("Approved application cannot be rejected");
        }

        if (application.getStatus() == ApplicationStatus.REJECTED) {
            throw new RuntimeException("Application is already rejected");
        }

        // Update status
        application.setStatus(ApplicationStatus.REJECTED);

        // Save
        Application savedApplication = applicationRepository.save(application);

        // Send rejection email
        Student student = application.getStudent();
        User user = student.getUser();

        if (user != null && user.getEmail() != null) {
            Job job = application.getJob();
            emailService.sendStudentRejectionEmail(user.getEmail(), student.getFullName(), job.getTitle());
        }

        return savedApplication;
    }
}