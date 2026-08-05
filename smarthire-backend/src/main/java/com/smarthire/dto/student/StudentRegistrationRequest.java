package com.smarthire.dto.student;

import org.springframework.web.multipart.MultipartFile;

import com.smarthire.enums.Branch;
import com.smarthire.enums.Course;

public class StudentRegistrationRequest 
{
    private String fullName;

    private String email;

    private String password;

    private String mobileNumber;

    private Course course;

    private Branch branch;

    private Integer passingYear;

    private Double cgpa;
    
    private String skills;

    private String linkedinUrl;

    private MultipartFile resume;

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public Branch getBranch() {
		return branch;
	}

	public void setBranch(Branch branch) {
		this.branch = branch;
	}

	public Integer getPassingYear() {
		return passingYear;
	}

	public void setPassingYear(Integer passingYear) {
		this.passingYear = passingYear;
	}

	public Double getCgpa() {
		return cgpa;
	}

	public void setCgpa(Double cgpa) {
		this.cgpa = cgpa;
	}

	public String getSkills() {
		return skills;
	}

	public void setSkills(String skills) {
		this.skills = skills;
	}

	public String getLinkedinUrl() {
		return linkedinUrl;
	}

	public void setLinkedinUrl(String linkedinUrl) {
		this.linkedinUrl = linkedinUrl;
	}


	public MultipartFile getResume() {
		return resume;
	}

	public void setResume(MultipartFile resume) {
		this.resume = resume;
	}
    
    
}
