package com.neurogine.backend.controller;

import com.neurogine.backend.entity.Project;
import com.neurogine.backend.repository.ProjectRepository;
import com.neurogine.backend.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        ApiResponse<List<Project>> response = new ApiResponse<>(
            true, 
            "Berhasil mengambil semua data project", 
            projects
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody Project project) {
        Project savedProject = projectRepository.save(project);
        ApiResponse<Project> response = new ApiResponse<>(
            true, 
            "Project berhasil ditambahkan", 
            savedProject
        );
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
            .map(project -> ResponseEntity.ok(
                new ApiResponse<>(true, "Project ditemukan", project)
            ))
            .orElse(ResponseEntity.status(404).body(
                new ApiResponse<>(false, "Project tidak ditemukan", null)
            ));
    }
}