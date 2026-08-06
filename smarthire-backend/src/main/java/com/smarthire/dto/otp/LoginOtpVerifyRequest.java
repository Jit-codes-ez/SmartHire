package com.smarthire.dto.otp;

public class LoginOtpVerifyRequest {

    private String email;
    private String otp;

    public LoginOtpVerifyRequest() {
    }

    public LoginOtpVerifyRequest(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}