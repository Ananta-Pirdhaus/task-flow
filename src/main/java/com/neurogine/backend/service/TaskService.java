package com.neurogine.backend.service;

import com.neurogine.backend.dto.task.TaskRequestDTO;
import com.neurogine.backend.dto.task.TaskResponseDTO;
import com.neurogine.backend.dto.task.TagRequestDTO;
import com.neurogine.backend.dto.task.TagResponseDTO;
import com.neurogine.backend.entity.task.Task;
import com.neurogine.backend.entity.task.Tag;
import com.neurogine.backend.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepo;

    // ================= CREATE =================
    public Task create(Long userId, TaskRequestDTO dto) {
        Task task = new Task();
        task.setUserId(userId);
        mapDtoToEntity(task, dto);
        return taskRepo.save(task);
    }

    // ================= READ =================
    public List<Task> findByUser(Long userId) {
        return taskRepo.findByUserId(userId);
    }

    public Task findByIdAndUser(String id, Long userId) {
        return taskRepo.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found or not owned by this user")
                );
    }

    // ================= UPDATE =================
    public Task update(String id, Long userId, TaskRequestDTO dto) {
        Task task = findByIdAndUser(id, userId);
        mapDtoToEntity(task, dto);
        return taskRepo.save(task);
    }

    // ================= DELETE =================
    public void delete(String id, Long userId) {
        if (!taskRepo.existsByIdAndUserId(id, userId)) {
            throw new RuntimeException("Task not found or not owned by this user");
        }
        taskRepo.deleteById(id);
    }

    // ================= DTO → ENTITY =================
    private void mapDtoToEntity(Task task, TaskRequestDTO dto) {

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());

        task.setStartDate(dto.getStartDate());
        task.setEndDate(dto.getEndDate());
        task.setStartTime(dto.getStartTime());
        task.setEndTime(dto.getEndTime());

        task.setImage(dto.getImage());
        task.setAlt(dto.getAlt());
        task.setProgress(dto.getProgress());

        if (dto.getTaskType() == null || dto.getTaskType().isBlank()) {
            throw new RuntimeException("taskType must not be empty");
        }
        task.setTaskType(dto.getTaskType());

        // ===== TAGS (SAFE REPLACE) =====
        if (task.getTags() == null) {
            task.setTags(new ArrayList<>());
        } else {
            task.getTags().clear();
        }

        if (dto.getTags() != null) {
            for (TagRequestDTO t : dto.getTags()) {
                Tag tag = new Tag();
                tag.setTitle(t.getTitle());
                tag.setColor(t.getColor());
                tag.setTask(task);
                task.getTags().add(tag);
            }
        }
    }

    // ================= ENTITY → RESPONSE =================
    public TaskResponseDTO toResponse(Task task) {

        TaskResponseDTO dto = new TaskResponseDTO();

        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setTaskType(task.getTaskType());
        dto.setProgress(task.getProgress());

        dto.setImage(task.getImage());
        dto.setAlt(task.getAlt());

        dto.setStartDate(task.getStartDate());
        dto.setEndDate(task.getEndDate());
        dto.setStartTime(task.getStartTime());
        dto.setEndTime(task.getEndTime());

        dto.setUserId(task.getUserId());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());

        if (task.getTags() != null) {
            dto.setTags(
                    task.getTags().stream()
                            .map(tag -> new TagResponseDTO(
                                    tag.getId(),
                                    tag.getTitle(),
                                    tag.getColor()
                            ))
                            .toList()
            );
        }

        return dto;
    }
}
