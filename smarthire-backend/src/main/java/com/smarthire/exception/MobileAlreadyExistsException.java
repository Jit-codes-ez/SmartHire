package com.smarthire.exception;

public class MobileAlreadyExistsException extends RuntimeException {

    public MobileAlreadyExistsException(String message) {
        super(message);
    }
}