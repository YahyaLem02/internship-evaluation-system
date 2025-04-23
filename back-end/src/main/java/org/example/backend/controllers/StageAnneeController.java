package org.example.backend.controllers;

import org.example.backend.dto.StageAnneeDTO;
import org.example.backend.services.StageAnneeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stageAnnee")
public class StageAnneeController {

    @Autowired
    private StageAnneeService stageAnneeService;

    // Endpoint pour créer un StageAnnee
    @PostMapping("/add")
    public StageAnneeDTO createStageAnnee(@RequestBody StageAnneeDTO stageAnneeDTO) {
        return stageAnneeService.createStageAnnee(stageAnneeDTO);
    }

    @GetMapping("/all")
    public List<StageAnneeDTO> getAllStageAnnees() {
        return stageAnneeService.getAllStageAnnees();
    }

    // Endpoint pour obtenir un StageAnnee par ID
    @GetMapping("/{id}")
    public StageAnneeDTO getStageAnnee(@PathVariable Long id) {
        return stageAnneeService.getStageAnnee(id);
    }

    // Endpoint pour mettre à jour un StageAnnee par ID
    @PutMapping("/{id}")
    public StageAnneeDTO updateStageAnnee(@PathVariable Long id, @RequestBody StageAnneeDTO stageAnneeDTO) {
        return stageAnneeService.updateStageAnnee(id, stageAnneeDTO);
    }

    // Endpoint pour supprimer un StageAnnee par ID
    @DeleteMapping("/{id}")
    public void deleteStageAnnee(@PathVariable Long id) {
        stageAnneeService.deleteStageAnnee(id);
    }
}
