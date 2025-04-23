package org.example.backend.controllers;

import org.example.backend.dto.StageDTO;
import org.example.backend.services.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stage")
public class StageController {

    @Autowired
    private StageService stageService;

    @GetMapping("/all")
    public List<StageDTO> getAll() {
        return stageService.getAllStages();
    }

    @GetMapping("/{id}")
    public StageDTO getById(@PathVariable Long id) {
        return stageService.getStageById(id);
    }

    @PostMapping("/add")
    public StageDTO create(@RequestBody StageDTO dto) {
        return stageService.createStage(dto);
    }

    @PutMapping("/{id}")
    public StageDTO update(@PathVariable Long id, @RequestBody StageDTO dto) {
        return stageService.updateStage(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        stageService.deleteStage(id);
    }
}
