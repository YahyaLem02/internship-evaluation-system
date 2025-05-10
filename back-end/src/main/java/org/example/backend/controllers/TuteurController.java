package org.example.backend.controllers;

import org.example.backend.dto.TuteurDTO;
import org.example.backend.dto.TuteurDetailDTO;
import org.example.backend.dto.TuteurDetailDTO;
import org.example.backend.services.TuteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tuteurs")
public class TuteurController {

    @Autowired
    private TuteurService tuteurService;

    @GetMapping
    public ResponseEntity<List<TuteurDetailDTO>> getAllTuteurs() {
        List<TuteurDetailDTO> tuteurs = tuteurService.getAllTuteurs();
        return ResponseEntity.ok(tuteurs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TuteurDetailDTO> getTuteurById(@PathVariable Long id) {
        TuteurDetailDTO tuteur = tuteurService.getTuteurById(id);
        if (tuteur == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tuteur);
    }

    @PostMapping
    public ResponseEntity<TuteurDTO> createTuteur(@RequestBody TuteurDTO tuteurDTO) {
        TuteurDTO created = tuteurService.createTuteur(tuteurDTO);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TuteurDTO> updateTuteur(@PathVariable Long id, @RequestBody TuteurDTO tuteurDTO) {
        TuteurDTO updated = tuteurService.updateTuteur(id, tuteurDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTuteur(@PathVariable Long id) {
        tuteurService.deleteTuteur(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Object>> checkTuteurByEmail(@RequestParam String email) {
        Map<String, Object> response = tuteurService.checkTuteurByEmail(email);
        return ResponseEntity.ok(response);
    }
}