package org.example.backend.services;

import jakarta.transaction.Transactional;
import org.example.backend.dto.StageCreateDTO;
import org.example.backend.dto.StageDTO;
import org.example.backend.dto.StagiaireDTO;
import org.example.backend.entities.*;
import org.example.backend.repositories.PeriodeRepository;
import org.example.backend.repositories.StagaireRepository;
import org.example.backend.repositories.StageAnneeRepository;
import org.example.backend.repositories.StageRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
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

    @Autowired
    private PeriodeRepository periodeRepository;

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

        Stage updated = stageRepository.save(existing);
        return modelMapper.map(updated, StageDTO.class);
    }

    public void deleteStage(Long id) {
        stageRepository.deleteById(id);
    }

    private StageDTO convertToDTO(Stage stage) {
        StageDTO dto = modelMapper.map(stage, StageDTO.class);
        if (stage.getPeriodes() != null) {
            Set<Long> stagiaireIds = stage.getPeriodes().stream()
                    .map(periode -> periode.getStagiaire().getId())
                    .collect(Collectors.toSet());
            dto.setStagiaireIds(stagiaireIds);
        }
        return dto;
    }

    @Transactional
    public StageDTO createStageViaShareLink(StageCreateDTO dto) {
        // 1. Find the StageAnnee via the token
        StageAnnee sa = stageAnneeRepository.findByShareToken(dto.getShareToken())
                .orElseThrow(() -> new RuntimeException("Invalid link"));

        // 2. Create the Stagiaire
        String generatedPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        dto.setMotDePasse(generatedPassword);

        Stagiaire stagiaire = new Stagiaire(
                dto.getNom(), dto.getPrenom(), dto.getEmail(), dto.getMotDePasse(), dto.getInstitution()
        );
        stagiaire = stagiaireRepository.save(stagiaire);

        // 3. Create the Stage associated with StageAnnee
        Stage stage = new Stage();
        stage.setDescription(dto.getDescription());
        stage.setObjectif(dto.getObjectif());
        stage.setEntreprise(dto.getEntreprise());
        stage.setStageAnnee(sa);
        stage = stageRepository.save(stage);

        // 4. Create and save the Periode
        PeriodeId periodeId = new PeriodeId(stagiaire.getId(), stage.getId());
        if (!periodeRepository.existsById(periodeId)) {
            Periode periode = new Periode();
            periode.setId(periodeId);
            periode.setStagiaire(stagiaire);
            periode.setStage(stage);
            periode.setDateDebut(dto.getDateDebut());
            periode.setDateFin(dto.getDateFin());

            System.out.println("Periode avant sauvegarde : " + periode);
            periodeRepository.save(periode);
            System.out.println("Periode après sauvegarde : " + periode);
        }

        // 5. Return the DTO
        return convertToDTO(stage);
    }


}