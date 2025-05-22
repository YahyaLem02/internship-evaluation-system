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

    public PeriodeDTO getPeriode(Long idStagiaire, Long idStage) {
        PeriodeId id = new PeriodeId(idStagiaire, idStage);
        Periode p = periodeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Periode not found"));

        return modelMapper.map(p, PeriodeDTO.class);
    }


    public PeriodeDTO createPeriode(PeriodeDTO dto) {
        Stagiaire stagiaire = stagiaireRepository.findById(dto.getIdStagiaire())
                .orElseThrow(() -> new EntityNotFoundException("Stagiaire not found"));
        Stage stage = stageRepository.findById(dto.getIdStage())
                .orElseThrow(() -> new EntityNotFoundException("Stage not found"));

        Periode p = new Periode();
        p.setId(new PeriodeId(dto.getIdStagiaire(), dto.getIdStage()));
        p.setStagiaire(stagiaire);
        p.setStage(stage);
        p.setDateDebut(dto.getDateDebut());
        p.setDateFin(dto.getDateFin());

        Periode saved = periodeRepository.save(p);
        return modelMapper.map(saved, PeriodeDTO.class);
    }

    public PeriodeDTO updatePeriode(Long idStagiaire, Long idStage, PeriodeDTO dto) {
        PeriodeId id = new PeriodeId(idStagiaire, idStage);
        Periode existing = periodeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Periode not found"));

        existing.setDateDebut(dto.getDateDebut());
        existing.setDateFin(dto.getDateFin());

        Periode updated = periodeRepository.save(existing);
        return modelMapper.map(updated, PeriodeDTO.class);
    }

    public void deletePeriode(Long idStagiaire, Long idStage) {
        PeriodeId id = new PeriodeId(idStagiaire, idStage);
        if (!periodeRepository.existsById(id)) {
            throw new EntityNotFoundException("Periode not found");
        }
        periodeRepository.deleteById(id);
    }
}
