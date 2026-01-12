package com.neurogine.backend.entity.task;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Priority {
    LOW,
    MEDIUM,
    HIGH;

    @JsonCreator
    public static Priority fromString(String value) {
        if (value == null) return null;
        return Priority.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}