package com.neurogine.backend.service;

import com.neurogine.backend.dto.*;
import com.neurogine.backend.entity.*;
import com.neurogine.backend.repository.*;
import com.neurogine.backend.security.JwtService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final LoginCodeRepository loginCodeRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            LoginCodeRepository loginCodeRepository,
            BCryptPasswordEncoder passwordEncoder,
            OtpService otpService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.loginCodeRepository = loginCodeRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.jwtService = jwtService;
    }

    /* ===================== REGISTER ===================== */

    public AuthUserDTO register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email sudah ada");
        }

        Role employeeRole = roleRepository.findByName("Employee")
                .orElseThrow(() -> new RuntimeException("Role Employee tidak ditemukan"));

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(employeeRole);

        return mapToDTO(userRepository.save(user));
    }

    /* ===================== LOGIN STEP 1 (PASSWORD + OTP) ===================== */

    @Transactional
    public Map<String, Object> login(Map<String, String> payload) {

        User user = userRepository.findByEmail(payload.get("email"))
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        if (!passwordEncoder.matches(payload.get("password"), user.getPassword())) {
            throw new RuntimeException("Password salah");
        }

        String otpCode = generateSixDigitCode();

        // 1 user = 1 OTP aktif
        loginCodeRepository.deleteByEmail(user.getEmail());

        LoginCode loginCode = new LoginCode();
        loginCode.setEmail(user.getEmail());
        loginCode.setCode(otpCode); // NOTE: idealnya di-hash
        loginCode.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        loginCodeRepository.save(loginCode);

        otpService.sendOtpEmail(user.getEmail(), otpCode);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OTP_REQUIRED");
        response.put("email", user.getEmail());
        response.put("message", "Kode OTP telah dikirim ke email Anda");

        return response;
    }

    /* ===================== LOGIN STEP 2 (OTP + JWT) ===================== */

    @Transactional
    public LoginResponseData verifyOtp(String email, String code) {

        LoginCode loginCode = loginCodeRepository.findByEmailAndCode(email, code)
                .orElseThrow(() -> new RuntimeException("Kode OTP salah atau tidak ditemukan"));

        if (loginCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            loginCodeRepository.delete(loginCode);
            throw new RuntimeException("Kode OTP sudah kadaluarsa");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        // OTP hanya sekali pakai
        loginCodeRepository.delete(loginCode);

        String jwtToken = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().getName()
        );

        return new LoginResponseData(jwtToken, "Bearer", mapToDTO(user));
    }

    /* ===================== UTIL ===================== */

    private String generateSixDigitCode() {
        SecureRandom random = new SecureRandom();
        return String.valueOf(100000 + random.nextInt(900000));
    }

    private AuthUserDTO mapToDTO(User user) {
        AuthUserDTO dto = new AuthUserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoleId(user.getRole().getId());
        dto.setRoleName(user.getRole().getName());
        return dto;
    }
}
