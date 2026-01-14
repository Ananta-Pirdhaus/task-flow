package com.neurogine.backend.config;

import com.neurogine.backend.entity.Role;
import com.neurogine.backend.entity.User;
import com.neurogine.backend.repository.RoleRepository;
import com.neurogine.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedUser(
            UserRepository userRepository,
            RoleRepository roleRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        return args -> {

            String email = "anantafirdaus20@webmail.umm.ac.id";

            // ❌ Jangan duplicate
            if (userRepository.existsByEmail(email)) {
                return;
            }

            Role role = roleRepository.findById(2L)
                    .orElseThrow(() -> new RuntimeException("Role ID 2 tidak ditemukan"));

            User user = new User();
            user.setName("Ananta Firdaus");
            user.setUsername("anantafirdaus");
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("N4nta<!>2023"));
            user.setRole(role);
            user.setCreatedAt(LocalDateTime.now()); // jika field ada

            userRepository.save(user);

            System.out.println("✅ User seed berhasil: " + email);
        };
    }
}
