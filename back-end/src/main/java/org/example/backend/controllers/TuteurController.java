package org.example.backend.controllers;

import org.example.backend.dto.TuteurDTO;
import org.example.backend.services.TuteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tuteur")
public class TuteurController {

    @Autowired
    private TuteurService tuteurService;

    @PostMapping("/add")
    public ResponseEntity<TuteurDTO> create(@RequestBody TuteurDTO dto) {
        return new ResponseEntity<>(tuteurService.createTuteur(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TuteurDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(tuteurService.getTuteurById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<TuteurDTO>> getAll() {
        return ResponseEntity.ok(tuteurService.getAllTuteurs());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TuteurDTO> update(@PathVariable Long id, @RequestBody TuteurDTO dto) {
        return ResponseEntity.ok(tuteurService.updateTuteur(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tuteurService.deleteTuteur(id);
        return ResponseEntity.noContent().build();
    }
}
