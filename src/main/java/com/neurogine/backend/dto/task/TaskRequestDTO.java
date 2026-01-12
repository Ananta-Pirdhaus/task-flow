package com.neurogine.backend.dto.task;
import com.neurogine.backend.entity.task.Priority;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TaskRequestDTO {

    private String title;
    private String description;
    private Priority priority;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String image;
    private String alt;
    private Integer progress;

    private Long userId;

    // backlog | inprogress | done
    private String taskType;

    private List<TagRequestDTO> tags;
}
