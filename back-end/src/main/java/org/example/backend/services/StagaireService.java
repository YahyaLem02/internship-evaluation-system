package org.example.backend.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.backend.dto.*;
import org.example.backend.entities.Periode;
import org.example.backend.entities.Stage;
import org.example.backend.entities.Stagiaire;
import org.example.backend.repositories.PeriodeRepository;
import org.example.backend.repositories.StagaireRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StagaireService {

    @Autowired
    private StagaireRepository stagiaireRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PeriodeRepository periodeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    public StagiaireDTO create(StagiaireDTO dto) {
        Stagiaire stagiaire = modelMapper.map(dto, Stagiaire.class);
        return modelMapper.map(stagiaireRepository.save(stagiaire), StagiaireDTO.class);
    }



    public List<StagiaireDTO> findAll() {
        return stagiaireRepository.findAll().stream()
                .map(s -> modelMapper.map(s, StagiaireDTO.class))
                .collect(Collectors.toList());
    }

    public Optional<StagiaireDTO> findById(Long id) {
        return stagiaireRepository.findById(id)
                .map(s -> modelMapper.map(s, StagiaireDTO.class));
    }

    @Transactional
    public StagiaireDTO updateStagiaire(Long id, StagiaireDTO stagiaireDTO) {
        Stagiaire existing = stagiaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stagiaire not found with id: " + id));

        existing.setNom(stagiaireDTO.getNom());
        existing.setPrenom(stagiaireDTO.getPrenom());
        existing.setEmail(stagiaireDTO.getEmail());
        existing.setInstitution(stagiaireDTO.getInstitution());

        if (stagiaireDTO.getMotDePasse() != null && !stagiaireDTO.getMotDePasse().isBlank()) {
            existing.setMotDePasse(stagiaireDTO.getMotDePasse());
        }

        Stagiaire updated = stagiaireRepository.save(existing);
        return modelMapper.map(updated, StagiaireDTO.class);
    }
    public void delete(Long id) {
        stagiaireRepository.deleteById(id);
    }


    public List<StagiaireDetailDTO> getAllStagiaires() {
        List<Stagiaire> stagiaires = stagiaireRepository.findAll();

        return stagiaires.stream()
                .map(this::mapStagiaireToStagiaireDetailDTO)
                .collect(Collectors.toList());
    }

    public StagiaireDetailDTO getStagiaireById(Long id) {
        Optional<Stagiaire> stagiaireOpt = stagiaireRepository.findById(id);
        if (stagiaireOpt.isEmpty()) {
            return null;
        }

        return mapStagiaireToStagiaireDetailDTO(stagiaireOpt.get());
    }

    private StagiaireDetailDTO mapStagiaireToStagiaireDetailDTO(Stagiaire stagiaire) {
        List<Periode> periodes = periodeRepository.findByStagiaireId(stagiaire.getId());

        String entrepriseStagiaire = null;
        String dateDebutStagiaire = null;
        String dateFinStagiaire = null;
        String appreciationTokenStagiaire = null;
        List<AppreciationDisplayDto> appreciationsStagiaire = new ArrayList<>();

        List<StageDetailDTO> stages = new ArrayList<>();

        if (periodes != null && !periodes.isEmpty()) {
            stages = periodes.stream()
                    .filter(periode -> periode.getStage() != null)
                    .map(periode -> {
                        Stage stage = periode.getStage();

                        List<AppreciationDisplayDto> appreciations = new ArrayList<>();
                        if (periode.getAppreciations() != null && !periode.getAppreciations().isEmpty()) {
                            appreciations = periode.getAppreciations().stream()
                                    .map(appreciation -> {
                                        List<EvaluationDTO> evaluations = appreciation.getEvaluations() != null ?
                                                appreciation.getEvaluations().stream()
                                                        .map(eval -> new EvaluationDTO(
                                                                eval.getCategorie(),
                                                                eval.getValeur()
                                                        ))
                                                        .collect(Collectors.toList()) :
                                                new ArrayList<>();

                                        List<CompetenceDTO> competences = appreciation.getCompetences() != null ?
                                                appreciation.getCompetences().stream()
                                                        .map(comp -> {
                                                            List<CategorieDTO> categories = comp.getCategories() != null ?
                                                                    comp.getCategories().stream()
                                                                            .map(cat -> new CategorieDTO(
                                                                                    cat.getIntitule(),
                                                                                    cat.getValeur()
                                                                            ))
                                                                            .collect(Collectors.toList()) :
                                                                    new ArrayList<>();

                                                            return new CompetenceDTO(
                                                                    comp.getIntitule(),
                                                                    comp.getNote(),
                                                                    categories
                                                            );
                                                        })
                                                        .collect(Collectors.toList()) :
                                                new ArrayList<>();

                                        return new AppreciationDisplayDto(
                                                appreciation.getId(),
                                                appreciation.getTuteur() != null ? appreciation.getTuteur().getNom() : null,
                                                appreciation.getTuteur() != null ? appreciation.getTuteur().getPrenom() : null,
                                                appreciation.getTuteur() != null ? appreciation.getTuteur().getEmail() : null,
                                                appreciation.getTuteur() != null ? appreciation.getTuteur().getEntreprise() : null,
                                                evaluations,
                                                competences,
                                                stage.getDescription(),
                                                stage.getObjectif()
                                        );
                                    })
                                    .collect(Collectors.toList());
                        }

                        return new StageDetailDTO(
                                stage.getId(),
                                stage.getEntreprise(),
                                stage.getDescription(),
                                stage.getObjectif(),
                                periode.getDateDebut() != null ? periode.getDateDebut().toString() : null,
                                periode.getDateFin() != null ? periode.getDateFin().toString() : null,
                                stage.getStageAnnee() != null ? stage.getStageAnnee().getId() : null,
                                stage.getStageAnnee() != null ? stage.getStageAnnee().getAnneeUniversitaire() : null,
                                stage.isEvaluated(),
                                appreciations
                        );
                    })
                    .collect(Collectors.toList());

            if (!stages.isEmpty() && !periodes.isEmpty()) {
                Periode premierePeriode = periodes.get(0);
                Stage premierStage = premierePeriode.getStage();

                if (premierStage != null) {
                    entrepriseStagiaire = premierStage.getEntreprise();
                }

                dateDebutStagiaire = premierePeriode.getDateDebut() != null ?
                        premierePeriode.getDateDebut().toString() : null;
                dateFinStagiaire = premierePeriode.getDateFin() != null ?
                        premierePeriode.getDateFin().toString() : null;
                appreciationTokenStagiaire = premierePeriode.getAppreciationToken();

                if (premierePeriode.getAppreciations() != null && !premierePeriode.getAppreciations().isEmpty()) {
                    appreciationsStagiaire = premierePeriode.getAppreciations().stream()
                            .map(appreciation -> {

                                List<EvaluationDTO> evaluations = appreciation.getEvaluations() != null ?
                                        appreciation.getEvaluations().stream()
                                                .map(eval -> new EvaluationDTO(
                                                        eval.getCategorie(),
                                                        eval.getValeur()
                                                ))
                                                .collect(Collectors.toList()) :
                                        new ArrayList<>();

                                List<CompetenceDTO> competences = appreciation.getCompetences() != null ?
                                        appreciation.getCompetences().stream()
                                                .map(comp -> {
                                                    List<CategorieDTO> categories = comp.getCategories() != null ?
                                                            comp.getCategories().stream()
                                                                    .map(cat -> new CategorieDTO(
                                                                            cat.getIntitule(),
                                                                            cat.getValeur()
                                                                    ))
                                                                    .collect(Collectors.toList()) :
                                                            new ArrayList<>();

                                                    return new CompetenceDTO(
                                                            comp.getIntitule(),
                                                            comp.getNote(),
                                                            categories
                                                    );
                                                })
                                                .collect(Collectors.toList()) :
                                        new ArrayList<>();

                                return new AppreciationDisplayDto(
                                        appreciation.getId(),
                                        appreciation.getTuteur() != null ? appreciation.getTuteur().getNom() : null,
                                        appreciation.getTuteur() != null ? appreciation.getTuteur().getPrenom() : null,
                                        appreciation.getTuteur() != null ? appreciation.getTuteur().getEmail() : null,
                                        appreciation.getTuteur() != null ? appreciation.getTuteur().getEntreprise() : null,
                                        evaluations,
                                        competences,
                                        premierStage != null ? premierStage.getDescription() : null,
                                        premierStage != null ? premierStage.getObjectif() : null
                                );
                            })
                            .collect(Collectors.toList());
                }
            }
        }

        boolean evaluated = stages.stream().anyMatch(StageDetailDTO::isEvaluated);

        return new StagiaireDetailDTO(
                stagiaire.getId(),
                stagiaire.getNom(),
                stagiaire.getPrenom(),
                stagiaire.getEmail(),
                stagiaire.getInstitution(),
                entrepriseStagiaire,
                dateDebutStagiaire,
                dateFinStagiaire,
                appreciationTokenStagiaire,
                appreciationsStagiaire,
                stages,
                evaluated
        );
    }
    @Transactional
    public void changePassword(Long id, String currentPassword, String newPassword) {
        Stagiaire stagiaire = stagiaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stagiaire non trouvé avec id: " + id));

        if (!passwordEncoder.matches(currentPassword, stagiaire.getMotDePasse())) {
            throw new IllegalArgumentException("Mot de passe actuel incorrect");
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Le nouveau mot de passe ne peut pas être vide");
        }

        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 6 caractères");
        }

        stagiaire.setMotDePasse(passwordEncoder.encode(newPassword));
        stagiaireRepository.save(stagiaire);
    }

}
