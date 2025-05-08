package org.example.backend.controllers;

import org.example.backend.dto.EvaluationDTO;
import org.example.backend.services.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluation")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;
//
//    @GetMapping
//    public List<EvaluationDTO> getAllEvaluations() {
//        return evaluationService.getAllEvaluations();
//    }
//
//    @GetMapping("/{id}")
//    public EvaluationDTO getEvaluationById(@PathVariable Long id) {
//        return evaluationService.getEvaluationById(id);
//    }
//
//    @PostMapping("/add")
//    public EvaluationDTO createEvaluation(@RequestBody EvaluationDTO dto) {
//        return evaluationService.createEvaluation(dto);
//    }
//
//    @PutMapping("/{id}")
//    public EvaluationDTO updateEvaluation(@PathVariable Long id, @RequestBody EvaluationDTO dto) {
//        return evaluationService.updateEvaluation(id, dto);
//    }

    @DeleteMapping("/{id}")
    public void deleteEvaluation(@PathVariable Long id) {
        evaluationService.deleteEvaluation(id);
    }
}
