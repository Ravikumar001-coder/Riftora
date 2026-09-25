package com.gameverse.core.exception;

public class OAuthLinkRequiredException extends RuntimeException {
    private final String email;

    public OAuthLinkRequiredException(String message, String email) {
        super(message);
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
