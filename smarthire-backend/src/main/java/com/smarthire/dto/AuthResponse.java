package com.smarthire.dto;

import com.smarthire.enums.Role;

public class AuthResponse {

    private String token;
    private String message;
    private Role role;

    public AuthResponse() {
    }

    public AuthResponse(String token, String message, Role role) {
        this.token = token;
        this.message = message;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}