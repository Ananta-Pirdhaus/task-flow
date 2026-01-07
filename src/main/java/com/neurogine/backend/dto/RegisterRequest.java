package com.neurogine.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String username;
    private String email;
    private String password;
    
    @JsonProperty("password_confirmation")
    private String passwordConfirmation;
}