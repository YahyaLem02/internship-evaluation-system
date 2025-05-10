package org.example.backend.controllers;

import org.example.backend.dto.AppreciationFormDTO;
import org.example.backend.dto.AppreciationTuteurDTO;
import org.example.backend.entities.Periode;
import org.example.backend.entities.Stage;
import org.example.backend.repositories.PeriodeRepository;
import org.example.backend.services.AppreciationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appreciation")
public class AppreciationController {

    private final AppreciationService appreciationService;
    private final PeriodeRepository periodeRepository;

    @Autowired
    public AppreciationController(AppreciationService appreciationService, PeriodeRepository periodeRepository) {
        this.appreciationService = appreciationService;
        this.periodeRepository = periodeRepository;
    }

    /**
     * Endpoint pour récupérer les informations initiales du formulaire
     */
    @GetMapping("/form/{token}")
    public ResponseEntity<?> getAppreciationForm(@PathVariable String token) {
        try {
            System.out.println("Récupération du formulaire avec token: " + token);
            Periode periode = periodeRepository.findByAppreciationToken(token)
                    .orElseThrow(() -> new RuntimeException("Lien d'appréciation invalide"));

            Stage stage = periode.getStage();

            Map<String, String> response = new HashMap<>();
            response.put("stageDescription", stage.getDescription() != null ? stage.getDescription() : "");
            response.put("stageObjectif", stage.getObjectif() != null ? stage.getObjectif() : "");

            System.out.println("Formulaire récupéré avec succès: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération du formulaire: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    /**
     * Endpoint pour soumettre le formulaire d'appréciation
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitAppreciation(@RequestBody AppreciationFormDTO form) {
        try {
            System.out.println("Soumission du formulaire d'appréciation: " + form);

            // Validation des données
            if (form.getToken() == null || form.getToken().isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Token manquant"));
            }

            // Validation des informations du tuteur
            if (form.getTuteur() == null) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Informations du tuteur manquantes"));
            }

            if (form.getTuteur().getNom() == null || form.getTuteur().getNom().isEmpty() ||
                    form.getTuteur().getPrenom() == null || form.getTuteur().getPrenom().isEmpty() ||
                    form.getTuteur().getEmail() == null || form.getTuteur().getEmail().isEmpty() ||
                    form.getTuteur().getEntreprise() == null || form.getTuteur().getEntreprise().isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Informations du tuteur incomplètes"));
            }

            if (form.getEvaluations() == null || form.getEvaluations().isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Évaluations manquantes"));
            }

            if (form.getCompetences() == null || form.getCompetences().isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Compétences manquantes"));
            }

            // Sauvegarde de l'appréciation
            appreciationService.saveAppreciation(form);

            System.out.println("Appréciation soumise avec succès");
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        } catch (Exception e) {
            System.err.println("Erreur lors de la soumission de l'appréciation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/tuteur/{tuteurId}")
    public ResponseEntity<List<AppreciationTuteurDTO>> getAppreciationsByTuteurId(@PathVariable Long tuteurId) {
        List<AppreciationTuteurDTO> appreciations = appreciationService.getAppreciationsByTuteurId(tuteurId);
        return ResponseEntity.ok(appreciations);
    }



}