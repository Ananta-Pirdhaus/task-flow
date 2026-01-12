package com.neurogine.backend.controller;

import com.neurogine.backend.dto.ApiResponse;
import com.neurogine.backend.dto.task.TaskRequestDTO;
import com.neurogine.backend.dto.task.TaskResponseDTO;
import com.neurogine.backend.entity.task.Task;
import com.neurogine.backend.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // ================= CREATE =================
    @PostMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> create(
            @PathVariable Long userId,
            @RequestBody TaskRequestDTO dto
    ) {
        Task task = taskService.create(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Task created successfully",
                        taskService.toResponse(task)
                ));
    }

    // ================= READ ALL BY USER =================
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> findByUser(
            @PathVariable Long userId
    ) {
        List<TaskResponseDTO> data = taskService.findByUser(userId)
                .stream()
                .map(taskService::toResponse)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Tasks fetched by user", data)
        );
    }

    // ================= READ BY ID & USER =================
    @GetMapping("/{id}/user/{userId}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> findById(
            @PathVariable String id,
            @PathVariable Long userId
    ) {
        Task task = taskService.findByIdAndUser(id, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task fetched", taskService.toResponse(task))
        );
    }

    // ================= UPDATE =================
    @PutMapping("/{id}/user/{userId}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> update(
            @PathVariable String id,
            @PathVariable Long userId,
            @RequestBody TaskRequestDTO dto
    ) {
        Task updated = taskService.update(id, userId, dto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task updated", taskService.toResponse(updated))
        );
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable String id,
            @PathVariable Long userId
    ) {
        taskService.delete(id, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task deleted", null)
        );
    }
}
