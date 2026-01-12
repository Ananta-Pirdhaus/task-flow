package com.neurogine.backend.service;

import com.neurogine.backend.dto.TaskRequestDTO;
import com.neurogine.backend.entity.task.Task;
import com.neurogine.backend.entity.task.Tag;
import com.neurogine.backend.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepo;

    public Task saveTask(TaskRequestDTO dto) {
        Task task = new Task();
        mapDtoToTask(task, dto);
        return taskRepo.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }

    public Task getTaskById(String id) {
        return taskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public List<Task> getTasksByUser(Long userId) {
        return taskRepo.findByUserId(userId);
    }

    public Task updateTask(String id, TaskRequestDTO dto) {
        Task task = getTaskById(id);
        mapDtoToTask(task, dto);
        return taskRepo.save(task);
    }

    public void deleteTask(String id) {
        if (!taskRepo.existsById(id)) {
            throw new RuntimeException("Task not found");
        }
        taskRepo.deleteById(id);
    }

    private void mapDtoToTask(Task task, TaskRequestDTO dto) {

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

        // user_id dari payload
        task.setUserId(dto.getUserId());

        // ✅ TASK TYPE LANGSUNG STRING (contoh: "backlog")
        if (dto.getTaskType() == null || dto.getTaskType().isBlank()) {
            throw new RuntimeException("task_type must not be null or empty");
        }
        task.setTaskType(dto.getTaskType());

        // ✅ TAGS (replace total, aman untuk update)
      // ✅ Perbaikan logic TAGS agar lebih stabil
if (task.getTags() == null) {
    task.setTags(new java.util.ArrayList<>());
} else {
    task.getTags().clear(); // Ini akan menghapus tag lama dari database karena orphanRemoval = true
}

if (dto.getTags() != null && !dto.getTags().isEmpty()) {
    List<Tag> newTags = dto.getTags().stream().map(t -> {
        Tag tag = new Tag();
        tag.setTitle(t.getTitle());
        tag.setColor(t.getColor());
        tag.setTask(task);
        return tag;
    }).collect(Collectors.toList());

    task.getTags().addAll(newTags); // Gunakan addAll alih-alih setTags untuk menjaga referensi koleksi
}
    }
}
