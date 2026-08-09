package com.smarthire.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smarthire.dto.cloudinary.CloudinaryUploadResponse;
import com.smarthire.dto.student.StudentRegistrationRequest;
import com.smarthire.dto.student.StudentRegistrationResponse;
import com.smarthire.entity.Student;
import com.smarthire.entity.User;
import com.smarthire.enums.OtpPurpose;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.smarthire.enums.Role;
import com.smarthire.exception.EmailAlreadyExistsException;
import com.smarthire.exception.EmailNotVerifiedException;
import com.smarthire.exception.MobileAlreadyExistsException;
import com.smarthire.repository.RecruiterRequestRepository;
import com.smarthire.repository.StudentRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.CloudinaryService;
import com.smarthire.service.OtpService;
import com.smarthire.service.StudentService;
import org.springframework.transaction.annotation.Transactional;




@Service
public class StudentServiceImpl implements StudentService {

	@Autowired
	UserRepository urepo;
	@Autowired
	StudentRepository srepo;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private CloudinaryService cloudinaryService;
	@Autowired
	private OtpService otpService;
	
	@Autowired
	private RecruiterRequestRepository recruiterRequestRepository; 

	@Override
	@Transactional
	public StudentRegistrationResponse registerStudent(StudentRegistrationRequest request) {

	    // 1. Check if email already exists
	    if (urepo.existsByEmail(request.getEmail())
	            || recruiterRequestRepository.existsByEmail(request.getEmail())) {

	        throw new EmailAlreadyExistsException("Email already exists.");
	    }

	    // 2. Check OTP verification
	    if (!otpService.isEmailVerified(
	            request.getEmail(),
	            OtpPurpose.REGISTRATION
	    )) {

	        throw new EmailNotVerifiedException(
	                "Please verify your email before registering."
	        );
	    }
	    
	    if (srepo.existsByMobileNumber(request.getMobileNumber())) {
	        throw new MobileAlreadyExistsException(
	                "Mobile number already registered."
	        );
	    }
	    
	    // 3. Create User
	    User user = new User();

	    user.setEmail(request.getEmail());
	    user.setPassword(
	            passwordEncoder.encode(request.getPassword())
	    );
	    user.setRole(Role.STUDENT);

	    // 4. Save User
	    User savedUser = urepo.save(user);

	    // 5. Create Student
	    Student student = new Student();

	    student.setFullName(request.getFullName());
	    student.setMobileNumber(request.getMobileNumber());
	    student.setCourse(request.getCourse());
	    student.setBranch(request.getBranch());
	    student.setPassingYear(request.getPassingYear());
	    student.setCgpa(request.getCgpa());
	    student.setSkills(request.getSkills());
	    student.setLinkedinUrl(request.getLinkedinUrl());

	    // 6. Upload resume
	    String folderName = request.getEmail()
	            .replace("@", "_")
	            .replace(".", "_")
	            .toLowerCase();

	    CloudinaryUploadResponse uploadResponse =
	            cloudinaryService.upload(
	                    request.getResume(),
	                    folderName
	            );

	    student.setResumeUrl(uploadResponse.getUrl());
	    student.setResumePublicId(
	            uploadResponse.getPublicId()
	    );

	    // 7. Link Student -> User
	    student.setUser(savedUser);

	    // 8. Save Student
	    // If this fails, @Transactional rolls back the User insert too.
	    Student savedStudent = srepo.save(student);

	    // 9. Prepare response
	    StudentRegistrationResponse response =
	            new StudentRegistrationResponse();

	    response.setStudentId(savedStudent.getId());
	    response.setEmail(savedUser.getEmail());
	    response.setRole(savedUser.getRole());
	    response.setMessage(
	            "Student registered successfully."
	    );

	    return response;
	}
	
	@Override
	public Student getStudentByEmail(String email) {
	    return srepo.findByUserEmail(email)
	            .orElseThrow(() -> new RuntimeException("Student not found"));
	}
	
	@Override
	public Student updateProfile(String email, Student student) {

	    Student existingStudent =
	            srepo.findByUserEmail(email)
	            .orElseThrow(
	                () -> new RuntimeException("Student not found")
	            );


	    existingStudent.setFullName(student.getFullName());
	    existingStudent.setMobileNumber(student.getMobileNumber());
	    existingStudent.setCourse(student.getCourse());
	    existingStudent.setBranch(student.getBranch());
	    existingStudent.setCgpa(student.getCgpa());
	    existingStudent.setSkills(student.getSkills());
	    existingStudent.setLinkedinUrl(student.getLinkedinUrl());
	    existingStudent.setPassingYear(student.getPassingYear());


	    return srepo.save(existingStudent);
	}
}