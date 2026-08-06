package com.smarthire.dto.otp;

public class LoginOtpRequest {

    private String email;

    public LoginOtpRequest() {
    }

    public LoginOtpRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}