package com.smarthire.dto;

import com.smarthire.enums.Role;

public class AdminResponse {

    private Long id;
    private String email;
    private Role role;

    public AdminResponse(Long id, String email, Role role) {
        this.id = id;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}