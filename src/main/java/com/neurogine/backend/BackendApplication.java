package com.neurogine.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // 1. Load .env file
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        
        // 2. Map variabel .env ke System Properties agar bisa dibaca @Value
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        SpringApplication.run(BackendApplication.class, args);
    }
}