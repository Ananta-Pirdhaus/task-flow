package com.neurogine.backend.repository;

import com.neurogine.backend.entity.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, String> {

    // sudah ada
    List<Task> findByUserId(Long userId);

    // 🔽 TAMBAHKAN INI
    Optional<Task> findByIdAndUserId(String id, Long userId);

    boolean existsByIdAndUserId(String id, Long userId);
}
