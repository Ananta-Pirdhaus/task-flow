package com.neurogine.backend.service;

import com.neurogine.backend.dto.*;
import com.neurogine.backend.entity.*;
import com.neurogine.backend.repository.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final LoginCodeRepository loginCodeRepository; // Tambahan repository
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, 
                       RoleRepository roleRepository, 
                       LoginCodeRepository loginCodeRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.loginCodeRepository = loginCodeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthUserDTO register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new RuntimeException("Email sudah ada");
        
        Role employeeRole = roleRepository.findByName("Employee").orElseThrow();
        
        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(employeeRole);
        
        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

    /**
     * Langkah 1: Validasi Password & Generate OTP
     */
    @Transactional
    public Map<String, Object> login(Map<String, String> payload) {
        User user = userRepository.findByEmail(payload.get("email"))
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        if (!passwordEncoder.matches(payload.get("password"), user.getPassword())) {
            throw new RuntimeException("Password salah");
        }

        // 1. Generate 6 digit OTP yang aman
        String otpCode = generateSixDigitCode();

        // 2. Hapus OTP lama jika ada dan simpan yang baru
        loginCodeRepository.deleteByEmail(user.getEmail());
        
        LoginCode loginCode = new LoginCode();
        loginCode.setEmail(user.getEmail());
        loginCode.setCode(otpCode);
        loginCode.setExpiresAt(LocalDateTime.now().plusMinutes(5)); // Valid 5 menit
        loginCodeRepository.save(loginCode);

        // 3. Log ke console (Ganti ini dengan kirim email asli jika sudah ada MailService)
        System.out.println("DEBUG: OTP untuk " + user.getEmail() + " adalah " + otpCode);

        // 4. Kirim sinyal ke Frontend untuk membuka modal
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OTP_REQUIRED");
        response.put("email", user.getEmail());
        response.put("message", "Kode OTP telah dikirim ke email (Cek console)");
        return response;
    }

    /**
     * Langkah 2: Verifikasi OTP & Kembalikan Token
     */
    @Transactional
    public LoginResponseData verifyOtp(String email, String code) {
        // 1. Cari kode di database
        LoginCode loginCode = loginCodeRepository.findByEmailAndCode(email, code)
                .orElseThrow(() -> new RuntimeException("Kode OTP salah atau tidak ditemukan"));

        // 2. Cek apakah kode sudah expired
        if (loginCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            loginCodeRepository.delete(loginCode);
            throw new RuntimeException("Kode OTP sudah kadaluarsa, silakan login ulang");
        }

        // 3. Ambil data user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        // 4. Hapus OTP dari database (sekali pakai)
        loginCodeRepository.delete(loginCode);

        // 5. Kembalikan Token Beneran (Ganti dummy-jwt dengan JWT Generator kamu)
        String actualJwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.real-token-for-" + user.getId();
        
        return new LoginResponseData(actualJwtToken, "Bearer", mapToDTO(user));
    }

    private String generateSixDigitCode() {
        SecureRandom random = new SecureRandom();
        int num = 100000 + random.nextInt(900000);
        return String.valueOf(num);
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