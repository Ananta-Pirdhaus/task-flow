package com.neurogine.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty; // Import ini penting
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import com.neurogine.backend.entity.task.Priority;

@Data
public class TaskRequestDTO {
    private String title;
    private String description;
    private Priority priority;

    // Masalah 1: Map "task_type" dari FE ke field ini
    // Tapi ingat, FE mengirim "backlog" (String), bukan ID (Long)
    @JsonProperty("task_type")
    private String taskType; // Ubah ke String jika FE mengirim "backlog"

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String image;
    private String alt;
    private Integer progress;

    // Masalah 2: Map "user_id" dari FE ke "userId"
    @JsonProperty("user_id")
    private Long userId;

    private List<TagDTO> tags;
}