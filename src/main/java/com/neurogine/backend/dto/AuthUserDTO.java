package com.neurogine.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AuthUserDTO {
    private Long id;
    private String name;
    private String username;
    private String email;
    
    @JsonProperty("role_id")
    private Long roleId;
    
    @JsonProperty("role_name")
    private String roleName;
}