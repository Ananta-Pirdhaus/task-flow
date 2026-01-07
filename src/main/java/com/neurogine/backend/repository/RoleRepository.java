package com.neurogine.backend.repository;

import com.neurogine.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Mencari role berdasarkan nama untuk pengecekan duplikasi
    Optional<Role> findByName(String name);
}