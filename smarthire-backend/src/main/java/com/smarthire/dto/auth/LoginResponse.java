package com.smarthire.dto.auth;

import com.smarthire.enums.Role;

public class LoginResponse {

    private String message;
    private String token;
    private String email;
    private Role role;


    public LoginResponse() {
    }


    public LoginResponse(String message, String token, String email, Role role) {
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