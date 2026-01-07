package com.neurogine.backend.config;

import com.neurogine.backend.entity.Role;
import com.neurogine.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component // Gunakan @Component agar terdeteksi sebagai bean otomatis
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    // Inject repository lewat constructor
    public DataSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> Menjalankan Data Seeder...");

        List<String> roleNames = Arrays.asList("Admin", "Project Lead", "Employee");

        for (String name : roleNames) {
            if (roleRepository.findByName(name).isEmpty()) {
                Role role = new Role();
                role.setName(name);
                roleRepository.save(role);
                System.out.println(">>> Role " + name + " berhasil dibuat.");
            } else {
                System.out.println(">>> Role " + name + " sudah ada, melewati...");
            }
        }
    }
}