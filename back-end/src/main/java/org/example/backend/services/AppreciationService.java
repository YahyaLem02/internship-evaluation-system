package org.example.backend.services;

import org.example.backend.dto.AppreciationDTO;
import org.example.backend.entities.*;
import org.example.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppreciationService {

    @Autowired private AppreciationRepository appreciationRepository;
    @Autowired private TuteurRepository tuteurRepository;
    @Autowired private PeriodeRepository periodeRepository;
    @Autowired private EvaluationRepository evaluationRepository;
    @Autowired private CompetenceRepository competenceRepository;

    public List<AppreciationDTO> getAllAppreciations() {
        return appreciationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AppreciationDTO getAppreciation(Long id) {
        return appreciationRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public AppreciationDTO createAppreciation(AppreciationDTO dto) {
        Appreciation appreciation = new Appreciation();

        tuteurRepository.findById(dto.getTuteurId())
                .ifPresent(appreciation::setTuteur);

        periodeRepository.findById_StagiaireIdAndId_StageId(dto.getStagiaireId(), dto.getStageId())
                .ifPresent(appreciation::setPeriode);

        if (dto.getEvaluationIds() != null) {
            Set<Evaluation> evaluations = new HashSet<>(evaluationRepository.findAllById(dto.getEvaluationIds()));
            for (Evaluation eval : evaluations) {
                eval.setAppreciation(appreciation);
            }
            appreciation.setEvaluations(evaluations);
        }

        if (dto.getCompetenceIds() != null) {
            Set<Competence> competences = new HashSet<>(competenceRepository.findAllById(dto.getCompetenceIds()));
            for (Competence comp : competences) {
                comp.setAppreciation(appreciation);
            }
            appreciation.setCompetences(competences);
        }

        return convertToDTO(appreciationRepository.save(appreciation));
    }

    public AppreciationDTO updateAppreciation(Long id, AppreciationDTO dto) {
        Optional<Appreciation> optional = appreciationRepository.findById(id);
        if (optional.isEmpty()) return null;

        Appreciation appreciation = optional.get();

        tuteurRepository.findById(dto.getTuteurId())
                .ifPresent(appreciation::setTuteur);

        periodeRepository.findById_StagiaireIdAndId_StageId(dto.getStagiaireId(), dto.getStageId())
                .ifPresent(appreciation::setPeriode);

        if (dto.getEvaluationIds() != null) {
            Set<Evaluation> evaluations = new HashSet<>(evaluationRepository.findAllById(dto.getEvaluationIds()));
            for (Evaluation eval : evaluations) {
                eval.setAppreciation(appreciation);
            }
            appreciation.setEvaluations(evaluations);
        }

        if (dto.getCompetenceIds() != null) {
            Set<Competence> competences = new HashSet<>(competenceRepository.findAllById(dto.getCompetenceIds()));
            for (Competence comp : competences) {
                comp.setAppreciation(appreciation);
            }
            appreciation.setCompetences(competences);
        }

        return convertToDTO(appreciationRepository.save(appreciation));
    }

    public void deleteAppreciation(Long id) {
        appreciationRepository.deleteById(id);
    }

    private AppreciationDTO convertToDTO(Appreciation appreciation) {
        Set<Long> evaluationIds = appreciation.getEvaluations() != null
                ? appreciation.getEvaluations().stream().map(Evaluation::getId).collect(Collectors.toSet())
                : new HashSet<>();

        Set<Long> competenceIds = appreciation.getCompetences() != null
                ? appreciation.getCompetences().stream().map(Competence::getId).collect(Collectors.toSet())
                : new HashSet<>();

        return new AppreciationDTO(
                appreciation.getId(),
                appreciation.getTuteur() != null ? appreciation.getTuteur().getId() : null,
                appreciation.getPeriode() != null ? appreciation.getPeriode().getId().getStagiaireId() : null,
                appreciation.getPeriode() != null ? appreciation.getPeriode().getId().getStageId() : null,
                evaluationIds,
                competenceIds
        );
    }
}
