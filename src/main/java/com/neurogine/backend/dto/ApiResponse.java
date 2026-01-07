package com.neurogine.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private String status; // "success" | "error"
    private String message;
    private T data;
}