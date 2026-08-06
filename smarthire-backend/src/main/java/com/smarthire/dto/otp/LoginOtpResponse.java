package com.smarthire.dto.otp;

public class LoginOtpResponse {

    private String message;
    private String email;
    private String token;
    private String role;

    public LoginOtpResponse() {
    }

    // Used for send-otp reply (no token yet)
    public LoginOtpResponse(String message, String email) {
        this.message = message;
        this.email = email;
    }

    // Used for verify-otp reply (token + role now available)
    public LoginOtpResponse(String message, String email, String token, String role) {
        this.message = message;
        this.email = email;
        this.token = token;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}