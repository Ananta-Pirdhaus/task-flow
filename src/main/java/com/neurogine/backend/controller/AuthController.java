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

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthUserDTO>> register(
            @RequestBody RegisterRequest request
    ) {
        try {
            AuthUserDTO user = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new ApiResponse<>(
                            true,
                            "User berhasil didaftarkan",
                            user
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            false,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    /**
     * ================= LOGIN STEP 1 =================
     * Cek email & password
     * Return info bahwa OTP dibutuhkan
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @RequestBody Map<String, String> payload
    ) {
        try {
            Map<String, Object> loginStatus = authService.login(payload);

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Silakan masukkan kode OTP",
                            loginStatus
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ApiResponse<>(
                            false,
                            e.getMessage(),
                            null
                    )
            );
        }
    }

    /**
     * ================= LOGIN STEP 2 =================
     * Verifikasi OTP
     * Return JWT + user data
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<LoginResponseData>> verifyOtp(
            @RequestBody Map<String, String> payload
    ) {
        try {
            String email = payload.get("email");
            String code = payload.get("code");

            if (email == null || code == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(
                                false,
                                "Email dan Kode OTP wajib diisi",
                                null
                        )
                );
            }

            LoginResponseData response = authService.verifyOtp(email, code);

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Login berhasil",
                            response
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse<>(
                            false,
                            e.getMessage(),
                            null
                    )
            );
        }
    }
}
