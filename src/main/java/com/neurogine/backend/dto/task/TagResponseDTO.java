package com.neurogine.backend.dto.task;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TagResponseDTO {
    private final String id;
    private final String title;
    private final String color;

    public TagResponseDTO(String id, String title, String color) {
        this.id = id;
        this.title = title;
        this.color = color;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getColor() { return color; }
}
