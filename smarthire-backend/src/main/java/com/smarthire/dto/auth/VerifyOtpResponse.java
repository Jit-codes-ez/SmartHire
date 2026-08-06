package com.smarthire.dto.auth;

import com.smarthire.enums.Role;

//It is used to verify successful OTP verification during Log In
public class VerifyOtpResponse {

    private String message;
    private String token;
    private String email;
    private Role role;

    public VerifyOtpResponse() {
    }
    
    public VerifyOtpResponse(String message, String token, String email, Role role) {
        this.message = message;
        this.token = token;
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}