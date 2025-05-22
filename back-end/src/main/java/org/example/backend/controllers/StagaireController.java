package org.example.backend.controllers;

import org.example.backend.dto.PasswordChangeRequest;
import org.example.backend.dto.StagiaireDTO;
import org.example.backend.dto.StagiaireDetailDTO;
import org.example.backend.services.StagaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stagaire")

public class StagaireController {
    @Autowired
    private StagaireService stagiaireService;

    @PostMapping("/add")
    public StagiaireDTO create(@RequestBody StagiaireDTO dto) {
        return stagiaireService.create(dto);
    }

    @PutMapping("/{id}")
    public StagiaireDTO update(@PathVariable Long id, @RequestBody StagiaireDTO dto) {
        return stagiaireService.updateStagiaire(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        stagiaireService.delete(id);
    }

    @GetMapping
    public ResponseEntity<List<StagiaireDetailDTO>> getAllStagiaires() {
        List<StagiaireDetailDTO> stagiaires = stagiaireService.getAllStagiaires();
        return ResponseEntity.ok(stagiaires);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StagiaireDetailDTO> getStagiaireById(@PathVariable Long id) {
        StagiaireDetailDTO stagiaire = stagiaireService.getStagiaireById(id);
        if (stagiaire == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(stagiaire);
    }

    @GetMapping("/me")
    public ResponseEntity<StagiaireDetailDTO> getCurrentStagiaire(Authentication authentication) {
        Long stagiaireId = Long.parseLong(authentication.getName());
        StagiaireDetailDTO stagiaire = stagiaireService.getStagiaireById(stagiaireId);
        if (stagiaire == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(stagiaire);
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody PasswordChangeRequest request, Authentication authentication) {
        try {
            Long authenticatedUserId = Long.parseLong(authentication.getName());
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"));

            if (!isAdmin && !authenticatedUserId.equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Vous n'êtes pas autorisé à modifier le mot de passe d'un autre utilisateur"));
            }

            stagiaireService.changePassword(id, request.getCurrentPassword(), request.getNewPassword());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Mot de passe modifié avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

}
