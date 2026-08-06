package com.smarthire.dto.auth;

// Its being used for verify the email during Registration
public class SendOtpRequest {
    private String email;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}