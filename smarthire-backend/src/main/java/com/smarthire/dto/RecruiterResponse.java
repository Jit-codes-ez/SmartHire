package com.smarthire.dto;

public class RecruiterResponse {

    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String companyName;
    private String designation;
    private String companyWebsite;
    private String city;
    private String state;
    private String country;
    private String industry;
    private String companyRegistrationNumber;

    public RecruiterResponse() {
    }

    public RecruiterResponse(
            Long id,
            String fullName,
            String email,
            String mobileNumber,
            String companyName,
            String designation,
            String companyWebsite,
            String city,
            String state,
            String country,
            String industry,
            String companyRegistrationNumber
    ) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.companyName = companyName;
        this.designation = designation;
        this.companyWebsite = companyWebsite;
        this.city = city;
        this.state = state;
        this.country = country;
        this.industry = industry;
        this.companyRegistrationNumber = companyRegistrationNumber;
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

    public String getCompanyName() {
        return companyName;
    }

    public String getDesignation() {
        return designation;
    }

    public String getCompanyWebsite() {
        return companyWebsite;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getCountry() {
        return country;
    }

    public String getIndustry() {
        return industry;
    }

    public String getCompanyRegistrationNumber() {
        return companyRegistrationNumber;
    }
}