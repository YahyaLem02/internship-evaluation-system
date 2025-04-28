package org.example.backend.services;

import org.example.backend.entities.StageAnnee;
import org.example.backend.dto.StageAnneeDTO;
import org.example.backend.repositories.StageAnneeRepository;
import org.example.backend.repositories.StageRepository;
import org.example.backend.entities.Stage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
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


        // Ajouter les stages associés à partir des IDs
        if (stageAnneeDTO.getStageIds() != null && !stageAnneeDTO.getStageIds().isEmpty()) {
            Set<Stage> stages = stageAnneeDTO.getStageIds().stream()
                    .map(id -> stageRepository.findById(id).orElseThrow(() -> new RuntimeException("Stage not found")))
                    .collect(Collectors.toSet());
            stageAnnee.setStages(stages);
        }

        StageAnnee savedStageAnnee = stageAnneeRepository.save(stageAnnee);
        return new StageAnneeDTO(savedStageAnnee.getId(), savedStageAnnee.getAnneeUniversitaire(), stageAnneeDTO.getStageIds(),
                savedStageAnnee.getDescription(), savedStageAnnee.getRegles());
    }

    // Lire un StageAnnee par son ID
public StageAnneeDTO getStageAnnee(Long id) {
    StageAnnee stageAnnee = stageAnneeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("StageAnnee not found"));
    Set<Long> stageIds = stageAnnee.getStages().stream()
            .map(Stage::getId)
            .collect(Collectors.toSet());
    return new StageAnneeDTO(stageAnnee.getId(), stageAnnee.getAnneeUniversitaire(),
            stageIds, stageAnnee.getDescription(), stageAnnee.getRegles());
}

    // Récupérer la liste de tous les StageAnnee
 public List<StageAnneeDTO> getAllStageAnnees() {
    List<StageAnnee> stageAnnees = stageAnneeRepository.findAll();
    return stageAnnees.stream().map(stageAnnee ->
                    new StageAnneeDTO(stageAnnee.getId(), stageAnnee.getAnneeUniversitaire(),
                            stageAnnee.getStages().stream().map(Stage::getId).collect(Collectors.toSet()),
                            stageAnnee.getDescription(), stageAnnee.getRegles()))
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
        stageAnneeDTO.getStageIds(), updatedStageAnnee.getDescription(), updatedStageAnnee.getRegles());
    }

    // Suppression d'un StageAnnee
    @Transactional
    public void deleteStageAnnee(Long id) {
        StageAnnee stageAnnee = stageAnneeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StageAnnee not found"));
        stageAnneeRepository.delete(stageAnnee);
    }
}
