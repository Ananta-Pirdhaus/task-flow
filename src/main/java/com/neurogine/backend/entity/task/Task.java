package com.neurogine.backend.entity.task;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "tasks")
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    // ✅ GANTI RELASI DENGAN STRING
    @Column(name = "task_type")
    @JsonProperty("task_type")
    private String taskType;

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    @JsonProperty("start_time")
    private LocalTime startTime;

    @JsonProperty("end_time")
    private LocalTime endTime;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    private String alt;

    private Integer progress;

    @Column(name = "user_id")
    @JsonProperty("user_id")
    private Long userId;

   @OneToMany(
    mappedBy = "task",
    fetch = FetchType.EAGER, // <--- Tambahkan ini
    cascade = CascadeType.ALL,
    orphanRemoval = true
    )
    @JsonManagedReference
    private List<Tag> tags;

    @CreationTimestamp
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
}
