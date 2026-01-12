package com.neurogine.backend.dto.task;
import com.neurogine.backend.entity.task.Priority;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TaskResponseDTO {

    private String id;
    private String title;
    private String description;
    private Priority priority; 
    private String taskType;
    private Integer progress;

    private String image;
    private String alt;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private Long userId;

    private List<TagResponseDTO> tags;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
