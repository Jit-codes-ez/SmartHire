package com.smarthire.dto;

import com.smarthire.enums.Branch;
import com.smarthire.enums.Course;

public class StudentResponse {
	private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private Course course;
    private Branch branch;
    private Integer passingYear;
    private Double cgpa;
    private String skills;
    private String linkedinUrl;
    private String resumeUrl;

    public StudentResponse() {
    }

    public StudentResponse(
            Long id,
            String fullName,
            String email,
            String mobileNumber,
            Course course,
            Branch branch,
            Integer passingYear,
            Double cgpa,
            String skills,
            String linkedinUrl,
            String resumeUrl
    ) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.course = course;
        this.branch = branch;
        this.passingYear = passingYear;
        this.cgpa = cgpa;
        this.skills = skills;
        this.linkedinUrl = linkedinUrl;
        this.resumeUrl = resumeUrl;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getMobileNumber() {
        return mobileNumber;
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

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

}
