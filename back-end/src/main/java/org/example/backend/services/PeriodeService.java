package org.example.backend.services;

import jakarta.persistence.EntityNotFoundException;
import org.example.backend.dto.PeriodeDTO;
import org.example.backend.entities.*;
import org.example.backend.repositories.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PeriodeService {

    @Autowired
    private PeriodeRepository periodeRepository;

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private StagaireRepository stagiaireRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Récupérer toutes les périodes
    public List<PeriodeDTO> getAllPeriodes() {
        return periodeRepository.findAll().stream()
                .map(p -> new PeriodeDTO(
                        p.getStage().getId(),
                        p.getStagiaire().getId(),
                        p.getDateDebut(),
                        p.getDateFin()
                ))
                .collect(Collectors.toList());
    }

    // Récupérer une période spécifique par ID composite
    public PeriodeDTO getPeriode(Long idStagiaire, Long idStage) {
        PeriodeId id = new PeriodeId(idStagiaire, idStage);  // Création de la clé composite
        Periode p = periodeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Periode not found"));

        return modelMapper.map(p, PeriodeDTO.class);
    }

    // Créer une nouvelle période
    public PeriodeDTO createPeriode(PeriodeDTO dto) {
        Stagiaire stagiaire = stagiaireRepository.findById(dto.getIdStagiaire())
                .orElseThrow(() -> new EntityNotFoundException("Stagiaire not found"));
        Stage stage = stageRepository.findById(dto.getIdStage())
                .orElseThrow(() -> new EntityNotFoundException("Stage not found"));

        // Créer une nouvelle période avec une clé composite
        Periode p = new Periode();
        p.setId(new PeriodeId(dto.getIdStagiaire(), dto.getIdStage()));  // Créer la clé composite
        p.setStagiaire(stagiaire);
        p.setStage(stage);
        p.setDateDebut(dto.getDateDebut());
        p.setDateFin(dto.getDateFin());

        Periode saved = periodeRepository.save(p);
        return modelMapper.map(saved, PeriodeDTO.class);
    }

    // Mettre à jour une période existante
    public PeriodeDTO updatePeriode(Long idStagiaire, Long idStage, PeriodeDTO dto) {
        PeriodeId id = new PeriodeId(idStagiaire, idStage);  // Créer l'ID composite
        Periode existing = periodeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Periode not found"));

        // Mettre à jour les dates
        existing.setDateDebut(dto.getDateDebut());
        existing.setDateFin(dto.getDateFin());

        Periode updated = periodeRepository.save(existing);
        return modelMapper.map(updated, PeriodeDTO.class);
    }

    // Supprimer une période par ID composite
    public void deletePeriode(Long idStagiaire, Long idStage) {
        PeriodeId id = new PeriodeId(idStagiaire, idStage);  // Créer l'ID composite
        if (!periodeRepository.existsById(id)) {
            throw new EntityNotFoundException("Periode not found");
        }
        periodeRepository.deleteById(id);
    }
}
