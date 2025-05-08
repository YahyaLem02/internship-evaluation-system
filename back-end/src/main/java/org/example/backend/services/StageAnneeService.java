package org.example.backend.services;

import org.example.backend.dto.*;
import org.example.backend.entities.StageAnnee;
import org.example.backend.repositories.StageAnneeRepository;
import org.example.backend.repositories.StageRepository;
import org.example.backend.entities.Stage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StageAnneeService {

    @Autowired
    private StageAnneeRepository stageAnneeRepository;
    @Autowired
    private StageRepository stageRepository;

    // Création d'un StageAnnee
    @Transactional
    public StageAnneeDTO createStageAnnee(StageAnneeDTO stageAnneeDTO) {
        StageAnnee stageAnnee = new StageAnnee();
        stageAnnee.setAnneeUniversitaire(stageAnneeDTO.getAnneeUniversitaire());
        stageAnnee.setDescription(stageAnneeDTO.getDescription());
        stageAnnee.setRegles(stageAnneeDTO.getRegles());
        stageAnnee.setShareToken(UUID.randomUUID().toString());


        // Ajouter les stages associés à partir des IDs
        if (stageAnneeDTO.getStageIds() != null && !stageAnneeDTO.getStageIds().isEmpty()) {
            Set<Stage> stages = stageAnneeDTO.getStageIds().stream()
                    .map(id -> stageRepository.findById(id).orElseThrow(() -> new RuntimeException("Stage not found")))
                    .collect(Collectors.toSet());
            stageAnnee.setStages(stages);
        }

        StageAnnee savedStageAnnee = stageAnneeRepository.save(stageAnnee);
        return new StageAnneeDTO(savedStageAnnee.getId(), savedStageAnnee.getAnneeUniversitaire(), stageAnneeDTO.getStageIds(),
                savedStageAnnee.getDescription(), savedStageAnnee.getRegles(), savedStageAnnee.getShareToken());
    }

    // Lire un StageAnnee par son ID
public StageAnneeDTO getStageAnnee(Long id) {
    StageAnnee stageAnnee = stageAnneeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("StageAnnee not found"));
    Set<Long> stageIds = stageAnnee.getStages().stream()
            .map(Stage::getId)
            .collect(Collectors.toSet());
    return new StageAnneeDTO(stageAnnee.getId(), stageAnnee.getAnneeUniversitaire(),
            stageIds, stageAnnee.getDescription(), stageAnnee.getRegles(), stageAnnee.getShareToken());
}

    // Récupérer la liste de tous les StageAnnee
 public List<StageAnneeDTO> getAllStageAnnees() {
    List<StageAnnee> stageAnnees = stageAnneeRepository.findAll();
    return stageAnnees.stream().map(stageAnnee ->
                    new StageAnneeDTO(stageAnnee.getId(), stageAnnee.getAnneeUniversitaire(),
                            stageAnnee.getStages().stream().map(Stage::getId).collect(Collectors.toSet()),
                            stageAnnee.getDescription(), stageAnnee.getRegles(), stageAnnee.getShareToken()))
            .collect(Collectors.toList());
}

    // Mise à jour d'un StageAnnee
    @Transactional
    public StageAnneeDTO updateStageAnnee(Long id, StageAnneeDTO stageAnneeDTO) {
        StageAnnee existingStageAnnee = stageAnneeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StageAnnee not found"));

        existingStageAnnee.setAnneeUniversitaire(stageAnneeDTO.getAnneeUniversitaire());
        existingStageAnnee.setDescription(stageAnneeDTO.getDescription());
        existingStageAnnee.setRegles(stageAnneeDTO.getRegles());


        // Mettre à jour les stages associés à partir des IDs
        if (stageAnneeDTO.getStageIds() != null && !stageAnneeDTO.getStageIds().isEmpty()) {
            Set<Stage> stages = stageAnneeDTO.getStageIds().stream()
                    .map(idStage -> stageRepository.findById(idStage)
                            .orElseThrow(() -> new RuntimeException("Stage not found")))
                    .collect(Collectors.toSet());
            existingStageAnnee.setStages(stages);
        }

        StageAnnee updatedStageAnnee = stageAnneeRepository.save(existingStageAnnee);
      return new StageAnneeDTO(updatedStageAnnee.getId(), updatedStageAnnee.getAnneeUniversitaire(),
        stageAnneeDTO.getStageIds(), updatedStageAnnee.getDescription(), updatedStageAnnee.getRegles(), updatedStageAnnee.getShareToken());
    }

    // Suppression d'un StageAnnee
    @Transactional
    public void deleteStageAnnee(Long id) {
        StageAnnee stageAnnee = stageAnneeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StageAnnee not found"));
        stageAnneeRepository.delete(stageAnnee);
    }
    public List<StagiaireDetailDTO> getStudentsForStageAnnee(Long stageAnneeId) {
        List<Stage> stages = stageRepository.findByStageAnneeId(stageAnneeId);

        return stages.stream()
                .flatMap(stage -> stage.getPeriodes().stream()
                        .map(periode -> new StagiaireDetailDTO(
                                periode.getStagiaire().getId(),
                                periode.getStagiaire().getNom(),
                                periode.getStagiaire().getPrenom(),
                                periode.getStagiaire().getEmail(),
                                periode.getStagiaire().getInstitution(),
                                stage.getEntreprise(), // Pass the stage's entreprise
                                periode.getDateDebut() != null ? periode.getDateDebut().toString() : null,
                                periode.getDateFin() != null ? periode.getDateFin().toString() : null,
                                periode.getAppreciationToken()
                                ))
                )
                .distinct() // Avoid duplicates if a student participates in multiple stages
                .collect(Collectors.toList());
    }

    public List<StagiaireDetailDTO> getStudentsWithEvaluations(Long stageAnneeId) {
        List<Stage> stages = stageRepository.findByStageAnneeId(stageAnneeId);

        return stages.stream()
                .flatMap(stage ->
                        stage.getPeriodes().stream().map(periode -> {
                            // Créer la liste des appréciations en vérifiant qu'elles existent
                            List<AppreciationDisplayDto> appreciations = periode.getAppreciations() != null && !periode.getAppreciations().isEmpty() ?
                                    periode.getAppreciations().stream()
                                            .map(appreciation -> {
                                                // Récupérer les évaluations
                                                List<EvaluationDTO> evaluations = appreciation.getEvaluations() != null ?
                                                        appreciation.getEvaluations().stream()
                                                                .map(eval -> new EvaluationDTO(
                                                                        eval.getCategorie(),
                                                                        eval.getValeur()
                                                                ))
                                                                .collect(Collectors.toList()) :
                                                        new ArrayList<>();

                                                // Récupérer les compétences avec leurs catégories
                                                List<CompetenceDTO> competences = appreciation.getCompetences() != null ?
                                                        appreciation.getCompetences().stream()
                                                                .map(comp -> new CompetenceDTO(
                                                                        comp.getIntitule(),
                                                                        comp.getNote(),
                                                                        comp.getCategories() != null ?
                                                                                comp.getCategories().stream()
                                                                                        .map(cat -> new CategorieDTO(
                                                                                                cat.getIntitule(),
                                                                                                cat.getValeur()
                                                                                        ))
                                                                                        .collect(Collectors.toList()) :
                                                                                new ArrayList<>()
                                                                ))
                                                                .collect(Collectors.toList()) :
                                                        new ArrayList<>();

                                                // Log pour débogage
                                                System.out.println("Appréciation ID: " + appreciation.getId() +
                                                        ", Évaluations: " + (evaluations != null ? evaluations.size() : "null") +
                                                        ", Compétences: " + (competences != null ? competences.size() : "null"));

                                                return new AppreciationDisplayDto(
                                                        appreciation.getId(),
                                                        appreciation.getTuteur() != null ? appreciation.getTuteur().getNom() : null,
                                                        appreciation.getTuteur() != null ? appreciation.getTuteur().getPrenom() : null,
                                                        appreciation.getTuteur() != null ? appreciation.getTuteur().getEmail() : null,
                                                        appreciation.getTuteur() != null ? appreciation.getTuteur().getEntreprise() : null,
                                                        evaluations,  // Ajouter les évaluations
                                                        competences,  // Ajouter les compétences
                                                        stage.getDescription(),
                                                        stage.getObjectif()
                                                );
                                            })
                                            .collect(Collectors.toList()) :
                                    new ArrayList<>();

                            // Ajoutez un log pour déboguer
                            System.out.println("Étudiant: " + periode.getStagiaire().getNom() +
                                    ", Evaluated: " + stage.isEvaluated() +
                                    ", Appréciations: " + appreciations.size());

                            return new StagiaireDetailDTO(
                                    periode.getStagiaire().getId(),
                                    periode.getStagiaire().getNom(),
                                    periode.getStagiaire().getPrenom(),
                                    periode.getStagiaire().getEmail(),
                                    periode.getStagiaire().getInstitution(),
                                    stage.getEntreprise(),
                                    periode.getDateDebut() != null ? periode.getDateDebut().toString() : null,
                                    periode.getDateFin() != null ? periode.getDateFin().toString() : null,
                                    periode.getAppreciationToken(),
                                    appreciations,
                                    stage.isEvaluated()
                            );
                        })
                ).distinct()
                .collect(Collectors.toList());
    }


}
