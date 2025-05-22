package org.example.backend.controllers;

import org.example.backend.dto.StageAnneeDTO;
import org.example.backend.dto.StagiaireDetailDTO;
import org.example.backend.entities.StageAnnee;
import org.example.backend.repositories.StageAnneeRepository;
import org.example.backend.services.StageAnneeService;
import org.example.backend.services.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stageAnnee")
public class StageAnneeController {

    @Autowired
    private StageAnneeService stageAnneeService;
    @Autowired
    private StageAnneeRepository stageAnneeRepository;
    @Autowired
    private StageService stageService;

    @PostMapping("/add")
    public StageAnneeDTO createStageAnnee(@RequestBody StageAnneeDTO stageAnneeDTO) {
        return stageAnneeService.createStageAnnee(stageAnneeDTO);
    }

    @GetMapping("/all")
    public List<StageAnneeDTO> getAllStageAnnees() {
        return stageAnneeService.getAllStageAnnees();
    }

    @GetMapping("/GetAnneeUniversitaire")
    public List<String> getAnneeUniversitaire() {
        return stageAnneeService.getAnneeUniversitaire();
    }

    @GetMapping("/{id}")
    public StageAnneeDTO getStageAnnee(@PathVariable Long id) {
        return stageAnneeService.getStageAnnee(id);
    }

    @PutMapping("/{id}")
    public StageAnneeDTO updateStageAnnee(@PathVariable Long id, @RequestBody StageAnneeDTO stageAnneeDTO) {
        return stageAnneeService.updateStageAnnee(id, stageAnneeDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteStageAnnee(@PathVariable Long id) {
        stageAnneeService.deleteStageAnnee(id);
    }

    @GetMapping("/token/{shareToken}")

    public StageAnneeDTO getStageAnneeByToken(@PathVariable String shareToken) {
        StageAnnee sa = stageAnneeRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new RuntimeException("Not found"));
        return new StageAnneeDTO(sa.getId(), sa.getAnneeUniversitaire(), null, sa.getDescription(), sa.getRegles(), sa.getShareToken());
    }

    @GetMapping("/{id}/students")
    public List<StagiaireDetailDTO> getStudentsForStageAnnee(@PathVariable Long id) {
        return stageAnneeService
                .getStudentsForStageAnnee(id);
    }
    @GetMapping("/{id}/students-with-evaluations")
    public List<StagiaireDetailDTO> getStudentsWithEvaluations(@PathVariable Long id) {
        return stageAnneeService.getStudentsWithEvaluations(id);
    }
}

