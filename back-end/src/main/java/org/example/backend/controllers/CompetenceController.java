package org.example.backend.controllers;

import org.example.backend.dto.CompetenceDTO;
import org.example.backend.services.CompetenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/competence")
public class CompetenceController {

     @Autowired
     private CompetenceService competenceService;

     @GetMapping
     public List<CompetenceDTO> getAll() {
          return competenceService.getAllCompetences();
     }

     @GetMapping("/{id}")
     public CompetenceDTO getById(@PathVariable Long id) {
          return competenceService.getCompetenceById(id);
     }

     @PostMapping("/add")
     public CompetenceDTO create(@RequestBody CompetenceDTO dto) {
          return competenceService.createCompetence(dto);
     }

     @PutMapping("/{id}")
     public CompetenceDTO update(@PathVariable Long id, @RequestBody CompetenceDTO dto) {
          return competenceService.updateCompetence(id, dto);
     }

     @DeleteMapping("/{id}")
     public void delete(@PathVariable Long id) {
          competenceService.deleteCompetence(id);
     }
}
