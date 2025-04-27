package org.example.backend.controllers;

import org.example.backend.dto.StagiaireDTO;
import org.example.backend.services.StagaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stagaire")

public class StagaireController {
    @Autowired
    private StagaireService stagiaireService;

    @PostMapping("/add")
    public StagiaireDTO create(@RequestBody StagiaireDTO dto) {
        return stagiaireService.create(dto);
    }

    @GetMapping
    public List<StagiaireDTO> getAll() {
        return stagiaireService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<StagiaireDTO> getById(@PathVariable Long id) {
        return stagiaireService.findById(id);
    }

    @PutMapping("/{id}")
    public StagiaireDTO update(@PathVariable Long id, @RequestBody StagiaireDTO dto) {
        return stagiaireService.updateStagiaire(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        stagiaireService.delete(id);
    }
}
