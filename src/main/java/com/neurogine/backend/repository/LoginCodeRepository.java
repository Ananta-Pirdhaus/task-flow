package com.neurogine.backend.repository;

import com.neurogine.backend.entity.LoginCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LoginCodeRepository extends JpaRepository<LoginCode, Long> {
    Optional<LoginCode> findByEmailAndCode(String email, String code);
    void deleteByEmail(String email); // Untuk membersihkan kode lama
}