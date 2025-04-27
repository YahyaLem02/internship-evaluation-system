package org.example.backend.services;

import org.example.backend.dto.EvaluationDTO;
import org.example.backend.entities.Appreciation;
import org.example.backend.entities.Evaluation;
import org.example.backend.repositories.AppreciationRepository;
import org.example.backend.repositories.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private AppreciationRepository appreciationRepository;

    public List<EvaluationDTO> getAllEvaluations() {
        return evaluationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EvaluationDTO getEvaluationById(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id).orElse(null);
        return evaluation != null ? convertToDTO(evaluation) : null;
    }

    public EvaluationDTO createEvaluation(EvaluationDTO dto) {
        Evaluation evaluation = new Evaluation();
        evaluation.setCategorie(dto.getCategorie());
        evaluation.setValeur(dto.getValeur());

        Optional<Appreciation> appreciation = appreciationRepository.findById(dto.getAppreciationId());
        appreciation.ifPresent(evaluation::setAppreciation);

        Evaluation saved = evaluationRepository.save(evaluation);
        return convertToDTO(saved);
    }

    public EvaluationDTO updateEvaluation(Long id, EvaluationDTO dto) {
        Optional<Evaluation> optionalEvaluation = evaluationRepository.findById(id);
        if (optionalEvaluation.isEmpty()) return null;

        Evaluation evaluation = optionalEvaluation.get();
        evaluation.setCategorie(dto.getCategorie());
        evaluation.setValeur(dto.getValeur());

        Optional<Appreciation> appreciation = appreciationRepository.findById(dto.getAppreciationId());
        appreciation.ifPresent(evaluation::setAppreciation);

        Evaluation updated = evaluationRepository.save(evaluation);
        return convertToDTO(updated);
    }

    public void deleteEvaluation(Long id) {
        evaluationRepository.deleteById(id);
    }

    private EvaluationDTO convertToDTO(Evaluation evaluation) {
        return new EvaluationDTO(
                evaluation.getId(),
                evaluation.getCategorie(),
                evaluation.getValeur(),
                evaluation.getAppreciation() != null ? evaluation.getAppreciation().getId() : null
        );
    }
}
