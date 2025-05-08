package org.example.backend.services;

import org.example.backend.dto.AppreciationFormDTO;
import org.example.backend.dto.CategorieDTO;
import org.example.backend.dto.CompetenceDTO;
import org.example.backend.dto.EvaluationDTO;
import org.example.backend.dto.TuteurDTO;
import org.example.backend.entities.*;
import org.example.backend.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class AppreciationService {

    private final PeriodeRepository periodeRepository;
    private final StageRepository stageRepository;
    private final AppreciationRepository appreciationRepository;
    private final EvaluationRepository evaluationRepository;
    private final CompetenceRepository competenceRepository;
    private final CategorieRepository categorieRepository;
    private final TuteurRepository tuteurRepository;

    @Autowired
    public AppreciationService(
            PeriodeRepository periodeRepository,
            StageRepository stageRepository,
            AppreciationRepository appreciationRepository,
            EvaluationRepository evaluationRepository,
            CompetenceRepository competenceRepository,
            CategorieRepository categorieRepository,
            TuteurRepository tuteurRepository) {
        this.periodeRepository = periodeRepository;
        this.stageRepository = stageRepository;
        this.appreciationRepository = appreciationRepository;
        this.evaluationRepository = evaluationRepository;
        this.competenceRepository = competenceRepository;
        this.categorieRepository = categorieRepository;
        this.tuteurRepository = tuteurRepository;
    }

    /**
     * Enregistre une appréciation complète à partir des données du formulaire
     */
    @Transactional
    public void saveAppreciation(AppreciationFormDTO form) {
        try {
            System.out.println("Début de saveAppreciation avec token: " + form.getToken());

            // Récupération de la période
            Periode periode = periodeRepository.findByAppreciationToken(form.getToken())
                    .orElseThrow(() -> new RuntimeException("Lien d'appréciation invalide"));
            System.out.println("Période trouvée avec ID: " + periode.getId());

            // Récupération et mise à jour du stage
            Stage stage = periode.getStage();
            System.out.println("Stage associé trouvé avec ID: " + stage.getId());

            // Mise à jour du stage
            System.out.println("Mise à jour du stage - Description: " + form.getStageDescription());
            System.out.println("Mise à jour du stage - Objectif: " + form.getStageObjectif());
            stage.setDescription(form.getStageDescription());
            stage.setObjectif(form.getStageObjectif());
            stage.setEvaluated(true);
            stage = stageRepository.save(stage);
            System.out.println("Stage mis à jour avec succès, ID: " + stage.getId());

            // Création ou récupération du tuteur
            TuteurDTO tuteurDTO = form.getTuteur();
            if (tuteurDTO == null) {
                System.err.println("ERREUR: Les informations du tuteur sont manquantes");
                throw new RuntimeException("Les informations du tuteur sont requises");
            }

            System.out.println("Traitement des informations du tuteur: " + tuteurDTO);

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
                System.out.println("Nouveau tuteur créé avec ID: " + tuteur.getId());
            } else {
                // Mettre à jour les informations du tuteur existant
                tuteur.setNom(tuteurDTO.getNom());
                tuteur.setPrenom(tuteurDTO.getPrenom());
                tuteur.setEntreprise(tuteurDTO.getEntreprise());
                tuteur = tuteurRepository.save(tuteur);
                System.out.println("Tuteur existant mis à jour avec ID: " + tuteur.getId());
            }

            // Création de l'appréciation
            System.out.println("Création d'une nouvelle appréciation");
            Appreciation appreciation = new Appreciation();
            appreciation.setPeriode(periode);
            appreciation.setTuteur(tuteur); // Associer le tuteur à l'appréciation
            appreciation = appreciationRepository.save(appreciation);
            System.out.println("Appréciation créée avec ID: " + appreciation.getId());

            // Vérification des données d'évaluation
            if (form.getEvaluations() == null || form.getEvaluations().isEmpty()) {
                System.err.println("ERREUR: Aucune évaluation dans le formulaire");
                throw new RuntimeException("Les évaluations sont requises");
            }

            System.out.println("Nombre d'évaluations à traiter: " + form.getEvaluations().size());

            // Traitement des évaluations
            for (EvaluationDTO evalDto : form.getEvaluations()) {
                try {
                    if (evalDto.getCategorie() == null || evalDto.getCategorie().isEmpty()) {
                        System.err.println("AVERTISSEMENT: Évaluation sans catégorie détectée, ignorée");
                        continue;
                    }

                    System.out.println("Traitement évaluation: " + evalDto);
                    Evaluation eval = new Evaluation();
                    eval.setCategorie(evalDto.getCategorie());
                    eval.setValeur(evalDto.getValeur());
                    eval.setAppreciation(appreciation);
                    eval = evaluationRepository.save(eval);
                    System.out.println("Évaluation créée: ID=" + eval.getId() +
                            ", catégorie=" + evalDto.getCategorie() +
                            ", valeur=" + evalDto.getValeur());
                } catch (Exception e) {
                    System.err.println("Erreur lors de la création d'une évaluation: " + e.getMessage());
                    e.printStackTrace();
                    // Continue malgré l'erreur pour traiter les autres évaluations
                }
            }

            // Vérification des données de compétences
            if (form.getCompetences() == null || form.getCompetences().isEmpty()) {
                System.err.println("ERREUR: Aucune compétence dans le formulaire");
                throw new RuntimeException("Les compétences sont requises");
            }

            System.out.println("Nombre de compétences à traiter: " + form.getCompetences().size());

            // Traitement des compétences
            for (CompetenceDTO compDto : form.getCompetences()) {
                try {
                    if (compDto.getIntitule() == null || compDto.getIntitule().isEmpty()) {
                        System.err.println("AVERTISSEMENT: Compétence sans intitulé détectée, ignorée");
                        continue;
                    }

                    System.out.println("Traitement compétence: " + compDto);
                    Competence comp = new Competence();
                    comp.setIntitule(compDto.getIntitule());
                    comp.setNote(compDto.getNote());
                    comp.setAppreciation(appreciation);
                    comp = competenceRepository.save(comp);
                    System.out.println("Compétence créée: ID=" + comp.getId() +
                            ", intitulé=" + compDto.getIntitule() +
                            ", note=" + compDto.getNote());

                    // Traitement des catégories de cette compétence
                    List<CategorieDTO> categories = compDto.getCategories();
                    if (categories != null && !categories.isEmpty()) {
                        System.out.println("Nombre de catégories à traiter pour cette compétence: " + categories.size());

                        for (CategorieDTO catDto : categories) {
                            try {
                                if (catDto.getIntitule() == null || catDto.getIntitule().isEmpty()) {
                                    System.err.println("AVERTISSEMENT: Catégorie sans intitulé détectée, ignorée");
                                    continue;
                                }

                                Categorie cat = new Categorie();
                                cat.setIntitule(catDto.getIntitule());
                                cat.setValeur(catDto.getValeur());
                                cat.setCompetence(comp);
                                cat = categorieRepository.save(cat);
                                System.out.println("Catégorie créée: ID=" + cat.getId() +
                                        ", intitulé=" + catDto.getIntitule() +
                                        ", valeur=" + catDto.getValeur());
                            } catch (Exception e) {
                                System.err.println("Erreur lors de la création d'une catégorie: " + e.getMessage());
                                e.printStackTrace();
                                // Continue malgré l'erreur pour traiter les autres catégories
                            }
                        }
                    } else {
                        System.out.println("Aucune catégorie pour cette compétence");
                    }
                } catch (Exception e) {
                    System.err.println("Erreur lors de la création d'une compétence: " + e.getMessage());
                    e.printStackTrace();
                    // Continue malgré l'erreur pour traiter les autres compétences
                }
            }

            System.out.println("Sauvegarde de l'appréciation terminée avec succès");
        } catch (Exception e) {
            System.err.println("ERREUR GLOBALE lors de la sauvegarde de l'appréciation: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la sauvegarde de l'appréciation: " + e.getMessage(), e);
        }
    }

    /**
     * Vérifie si un token d'appréciation est valide
     */
    public boolean isAppreciationTokenValid(String token) {
        return periodeRepository.findByAppreciationToken(token).isPresent();
    }
}