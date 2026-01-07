package com.neurogine.backend.controller;

import com.neurogine.backend.dto.*;
import com.neurogine.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthUserDTO>> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success", "User berhasil didaftarkan", authService.register(request)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    /**
     * Endpoint Tahap 1: Cek Email & Password
     * Mengembalikan status OTP_REQUIRED jika sukses
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(@RequestBody Map<String, String> payload) {
        try {
            // Kita gunakan Object sebagai generic ApiResponse karena isinya sekarang berupa Map (status & email)
            Map<String, Object> loginStatus = authService.login(payload);
            return ResponseEntity.ok(new ApiResponse<>("success", "Silakan masukkan kode OTP", loginStatus));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    /**
     * Endpoint Tahap 2: Verifikasi OTP
     * Mengembalikan JWT Token dan Data User jika OTP benar
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<LoginResponseData>> verifyOtp(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String code = payload.get("code");

            if (email == null || code == null) {
                throw new RuntimeException("Email dan Kode OTP wajib diisi");
            }

            LoginResponseData response = authService.verifyOtp(email, code);
            return ResponseEntity.ok(new ApiResponse<>("success", "Login Berhasil", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }
}