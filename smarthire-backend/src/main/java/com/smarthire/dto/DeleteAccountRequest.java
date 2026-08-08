package com.smarthire.dto;

public class DeleteAccountRequest {

    private String reason;

    public DeleteAccountRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}