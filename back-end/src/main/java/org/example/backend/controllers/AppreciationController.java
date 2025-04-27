package org.example.backend.controllers;

import org.example.backend.dto.AppreciationDTO;
import org.example.backend.services.AppreciationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appreciation")
public class AppreciationController {

    @Autowired
    private AppreciationService appreciationService;

    // Récupérer toutes les appréciations
    @GetMapping
    public List<AppreciationDTO> getAllAppreciations() {
        return appreciationService.getAllAppreciations();
    }

    // Récupérer une appréciation par ID
    @GetMapping("/{id}")
    public AppreciationDTO getAppreciation(@PathVariable Long id) {
        return appreciationService.getAppreciation(id);
    }

    // Créer une nouvelle appréciation
    @PostMapping("/add")
    public AppreciationDTO createAppreciation(@RequestBody AppreciationDTO appreciationDTO) {
        return appreciationService.createAppreciation(appreciationDTO);
    }

    // Mettre à jour une appréciation existante
    @PutMapping("/{id}")
    public AppreciationDTO updateAppreciation(@PathVariable Long id, @RequestBody AppreciationDTO appreciationDTO) {
        return appreciationService.updateAppreciation(id, appreciationDTO);
    }

    // Supprimer une appréciation
    @DeleteMapping("/{id}")
    public void deleteAppreciation(@PathVariable Long id) {
        appreciationService.deleteAppreciation(id);
    }
}
