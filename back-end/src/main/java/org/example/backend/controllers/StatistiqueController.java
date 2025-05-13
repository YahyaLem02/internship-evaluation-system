package org.example.backend.controllers;

import org.example.backend.dto.DashboardStatsDTO;
import org.example.backend.services.StatistiqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/statistiques")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StatistiqueController {

    @Autowired
    private StatistiqueService statistiqueService;

    /**
     * Récupère toutes les statistiques pour le tableau de bord
     * @return DTO contenant toutes les statistiques
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(statistiqueService.getDashboardStats());
    }

    /**
     * Récupère les statistiques sur les stages
     * @return Map contenant les statistiques sur les stages
     */
    @GetMapping("/stages")
    public ResponseEntity<Map<String, Object>> getStageStats() {
        return ResponseEntity.ok(statistiqueService.getStageStats());
    }

    /**
     * Récupère les statistiques sur les stagiaires
     * @return Map contenant les statistiques sur les stagiaires
     */
    @GetMapping("/stagiaires")
    public ResponseEntity<Map<String, Object>> getStagiaireStats() {
        return ResponseEntity.ok(statistiqueService.getStagiaireStats());
    }

    /**
     * Récupère les statistiques sur les tuteurs
     * @return Map contenant les statistiques sur les tuteurs
     */
    @GetMapping("/tuteurs")
    public ResponseEntity<Map<String, Object>> getTuteurStats() {
        return ResponseEntity.ok(statistiqueService.getTuteurStats());
    }

    /**
     * Récupère les statistiques sur les évaluations et compétences
     * @return Map contenant les statistiques sur les évaluations
     */
    @GetMapping("/evaluations")
    public ResponseEntity<Map<String, Object>> getEvaluationStats() {
        return ResponseEntity.ok(statistiqueService.getEvaluationStats());
    }
}