package org.example.backend.services;

import org.example.backend.dto.StageDTO;
import org.example.backend.entities.Stage;
import org.example.backend.entities.StageAnnee;
import org.example.backend.entities.Stagiaire;
import org.example.backend.repositories.StagaireRepository;
import org.example.backend.repositories.StageAnneeRepository;
import org.example.backend.repositories.StageRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StageService {

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private StageAnneeRepository stageAnneeRepository;

    @Autowired
    private StagaireRepository stagiaireRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<StageDTO> getAllStages() {
        return stageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StageDTO getStageById(Long id) {
        Stage stage = stageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stage not found"));
        return convertToDTO(stage);
    }




    public StageDTO createStage(StageDTO dto) {
        Stage stage = new Stage();
        stage.setDescription(dto.getDescription());
        stage.setObjectif(dto.getObjectif());
        stage.setEntreprise(dto.getEntreprise());

        if (dto.getStageAnneeId() != null) {
            StageAnnee stageAnnee = stageAnneeRepository.findById(dto.getStageAnneeId())
                    .orElseThrow(() -> new EntityNotFoundException("StageAnnee not found"));
            stage.setStageAnnee(stageAnnee);
        }

        if (dto.getStagiaireIds() != null) {
            Set<Stagiaire> stagiaires = dto.getStagiaireIds().stream()
                    .map(id -> stagiaireRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("Stagiaire not found")))
                    .collect(Collectors.toSet());
            stage.setStagiaires(stagiaires);
        }

        Stage saved = stageRepository.save(stage);
        return modelMapper.map(saved, StageDTO.class);
    }

    public StageDTO updateStage(Long id, StageDTO dto) {
        Stage existing = stageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stage not found"));

        existing.setDescription(dto.getDescription());
        existing.setObjectif(dto.getObjectif());
        existing.setEntreprise(dto.getEntreprise());

        if (dto.getStageAnneeId() != null) {
            StageAnnee stageAnnee = stageAnneeRepository.findById(dto.getStageAnneeId())
                    .orElseThrow(() -> new EntityNotFoundException("StageAnnee not found"));
            existing.setStageAnnee(stageAnnee);
        }

        if (dto.getStagiaireIds() != null) {
            Set<Stagiaire> stagiaires = dto.getStagiaireIds().stream()
                    .map(stagiaireId -> stagiaireRepository.findById(stagiaireId)
                            .orElseThrow(() -> new EntityNotFoundException("Stagiaire not found")))
                    .collect(Collectors.toSet());
            existing.setStagiaires(stagiaires);
        }
        Stage updated = stageRepository.save(existing);
        return modelMapper.map(updated, StageDTO.class);
    }

    public void deleteStage(Long id) {
        stageRepository.deleteById(id);
    }
    private StageDTO convertToDTO(Stage stage) {
        StageDTO dto = modelMapper.map(stage, StageDTO.class);
        if (stage.getStagiaires() != null) {
            Set<Long> ids = stage.getStagiaires().stream()
                    .map(Stagiaire::getId)
                    .collect(Collectors.toSet());
            dto.setStagiaireIds(ids);
        }
        return dto;
    }

}
