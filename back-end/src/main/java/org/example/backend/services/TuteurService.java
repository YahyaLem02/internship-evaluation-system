package org.example.backend.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.backend.dto.*;
import org.example.backend.entities.*;
import org.example.backend.repositories.AppreciationRepository;
import org.example.backend.repositories.TuteurRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TuteurService {

    @Autowired
    private TuteurRepository tuteurRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AppreciationRepository appreciationRepository;

    public TuteurDTO createTuteur(TuteurDTO tuteurDTO) {
        Tuteur tuteur = modelMapper.map(tuteurDTO, Tuteur.class);
        Tuteur saved = tuteurRepository.save(tuteur);
        return modelMapper.map(saved, TuteurDTO.class);
    }

    @Transactional
    public TuteurDTO updateTuteur(Long id, TuteurDTO tuteurDTO) {
        Tuteur existing = tuteurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tuteur not found with id: " + id));

        // On met à jour les champs sauf l'ID
        existing.setNom(tuteurDTO.getNom());
        existing.setPrenom(tuteurDTO.getPrenom());
        existing.setEmail(tuteurDTO.getEmail());
        existing.setEntreprise(tuteurDTO.getEntreprise());

        // Mettre à jour le mot de passe uniquement s'il est présent
        if (tuteurDTO.getMotDePasse() != null && !tuteurDTO.getMotDePasse().isBlank()) {
            existing.setMotDePasse(tuteurDTO.getMotDePasse());
        }
        Tuteur updated = tuteurRepository.save(existing);
        return modelMapper.map(updated, TuteurDTO.class);
    }

    public void deleteTuteur(Long id) {
        tuteurRepository.deleteById(id);
    }

    // Méthode modifiée pour retourner TuteurListDTO au lieu de TuteurDTO
    public List<TuteurDetailDTO> getAllTuteurs() {
        List<Tuteur> tuteurs = tuteurRepository.findAll();

        return tuteurs.stream()
                .map(tuteur -> {
                    // Compter le nombre d'appréciations
                    List<Appreciation> appreciations = appreciationRepository.findByTuteurId(tuteur.getId());
                    int nbAppreciations = appreciations.size();

                    // Récupérer le nombre de stagiaires uniques évalués
                    Set<Long> stagiaireIds = appreciations.stream()
                            .map(a -> a.getPeriode().getStagiaire().getId())
                            .collect(Collectors.toSet());
                    int nbStagiaires = stagiaireIds.size();

                    // Créer le DTO avec les informations supplémentaires
                    return new TuteurDetailDTO(
                            tuteur.getId(),
                            tuteur.getNom(),
                            tuteur.getPrenom(),
                            tuteur.getEmail(),
                            tuteur.getEntreprise(),
                            nbStagiaires,
                            nbAppreciations
                    );
                })
                .collect(Collectors.toList());
    }

    public TuteurDetailDTO getTuteurById(Long id) {
        Optional<Tuteur> tuteurOpt = tuteurRepository.findById(id);
        if (tuteurOpt.isEmpty()) {
            return null;
        }

        Tuteur tuteur = tuteurOpt.get();
        List<Appreciation> appreciations = appreciationRepository.findByTuteurId(tuteur.getId());

        // Nombre de stagiaires uniques
        Set<Long> stagiaireIds = appreciations.stream()
                .map(a -> a.getPeriode().getStagiaire().getId())
                .collect(Collectors.toSet());
        int nbStagiaires = stagiaireIds.size();

        // Récupérer les détails des appréciations
        List<AppreciationTuteurDTO> appreciationDTOs = appreciations.stream()
                .map(appreciation -> {
                    Periode periode = appreciation.getPeriode();
                    Stagiaire stagiaire = periode.getStagiaire();
                    Stage stage = periode.getStage();

                    // Récupérer les évaluations
                    List<EvaluationDTO> evaluations = appreciation.getEvaluations().stream()
                            .map(eval -> new EvaluationDTO(
                                    eval.getCategorie(),
                                    eval.getValeur()
                            ))
                            .collect(Collectors.toList());

                    // Récupérer les compétences avec leurs catégories
                    List<CompetenceDTO> competences = appreciation.getCompetences().stream()
                            .map(comp -> {
                                List<CategorieDTO> categories = comp.getCategories().stream()
                                        .map(cat -> new CategorieDTO(
                                                cat.getIntitule(),
                                                cat.getValeur()
                                        ))
                                        .collect(Collectors.toList());

                                return new CompetenceDTO(
                                        comp.getIntitule(),
                                        comp.getNote(),
                                        categories
                                );
                            })
                            .collect(Collectors.toList());

                    return new AppreciationTuteurDTO(
                            appreciation.getId(),
                            stagiaire.getNom(),
                            stagiaire.getPrenom(),
                            stagiaire.getEmail(),
                            stage.getEntreprise(),
                            periode.getDateDebut() != null ? periode.getDateDebut().toString() : null,
                            periode.getDateFin() != null ? periode.getDateFin().toString() : null,
                            evaluations,
                            competences,
                            stage.getDescription(),
                            stage.getObjectif()
                    );
                })
                .collect(Collectors.toList());

        // Créer et retourner le DTO détaillé du tuteur
        return new TuteurDetailDTO(
                tuteur.getId(),
                tuteur.getNom(),
                tuteur.getPrenom(),
                tuteur.getEmail(),
                tuteur.getEntreprise(),
                nbStagiaires,
                appreciationDTOs.size(),
                appreciationDTOs
        );
    }

    public Map<String, Object> checkTuteurByEmail(String email) {
        Map<String, Object> response = new HashMap<>();
        Optional<Tuteur> tuteurOpt = tuteurRepository.findByEmail(email);

        if (tuteurOpt.isPresent()) {
            Tuteur tuteur = tuteurOpt.get();
            response.put("exists", true);
            response.put("id", tuteur.getId());
            response.put("nom", tuteur.getNom());
            response.put("prenom", tuteur.getPrenom());
            response.put("entreprise", tuteur.getEntreprise());
        } else {
            response.put("exists", false);
        }

        return response;
    }

    /**
     * Recherche un tuteur par email ou en crée un nouveau si nécessaire
     *
     * @param tuteurDTO DTO contenant les informations du tuteur
     * @return Tuteur créé ou mis à jour
     */
    public Tuteur findOrCreateTuteur(TuteurDTO tuteurDTO) {
        if (tuteurDTO == null) {
            throw new RuntimeException("Les informations du tuteur sont requises");
        }

        // Chercher d'abord si le tuteur existe déjà par email
        Tuteur tuteur = null;
        if (tuteurDTO.getEmail() != null && !tuteurDTO.getEmail().isEmpty()) {
            tuteur = tuteurRepository.findByEmail(tuteurDTO.getEmail()).orElse(null);
        }

        // Si le tuteur n'existe pas, en créer un nouveau
        if (tuteur == null) {
            tuteur = new Tuteur();
            tuteur.setNom(tuteurDTO.getNom());
            tuteur.setPrenom(tuteurDTO.getPrenom());
            tuteur.setEmail(tuteurDTO.getEmail());
            tuteur.setEntreprise(tuteurDTO.getEntreprise());
            tuteur = tuteurRepository.save(tuteur);
        } else {
            // Mettre à jour les informations du tuteur existant
            tuteur.setNom(tuteurDTO.getNom());
            tuteur.setPrenom(tuteurDTO.getPrenom());
            tuteur.setEntreprise(tuteurDTO.getEntreprise());
            tuteur = tuteurRepository.save(tuteur);
        }

        return tuteur;
    }
}