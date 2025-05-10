package org.example.backend.dto;

import java.util.List;

public class AppreciationTuteurDTO {
    private Long id;
    private String stagiaireNom;
    private String stagiairePrenom;
    private String stagiaireEmail;
    private String entreprise;
    private String dateDebut;
    private String dateFin;
    private List<EvaluationDTO> evaluations;
    private List<CompetenceDTO> competences;
    private String stageDescription;
    private String stageObjectif;

    // Constructeur par défaut pour Jackson
    public AppreciationTuteurDTO() {
    }

    public AppreciationTuteurDTO(Long id, String stagiaireNom, String stagiairePrenom, String stagiaireEmail,
                                 String entreprise, String dateDebut, String dateFin,
                                 List<EvaluationDTO> evaluations, List<CompetenceDTO> competences,
                                 String stageDescription, String stageObjectif) {
        this.id = id;
        this.stagiaireNom = stagiaireNom;
        this.stagiairePrenom = stagiairePrenom;
        this.stagiaireEmail = stagiaireEmail;
        this.entreprise = entreprise;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.evaluations = evaluations;
        this.competences = competences;
        this.stageDescription = stageDescription;
        this.stageObjectif = stageObjectif;
    }

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStagiaireNom() {
        return stagiaireNom;
    }

    public void setStagiaireNom(String stagiaireNom) {
        this.stagiaireNom = stagiaireNom;
    }

    public String getStagiairePrenom() {
        return stagiairePrenom;
    }

    public void setStagiairePrenom(String stagiairePrenom) {
        this.stagiairePrenom = stagiairePrenom;
    }

    public String getStagiaireEmail() {
        return stagiaireEmail;
    }

    public void setStagiaireEmail(String stagiaireEmail) {
        this.stagiaireEmail = stagiaireEmail;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public String getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(String dateDebut) {
        this.dateDebut = dateDebut;
    }

    public String getDateFin() {
        return dateFin;
    }

    public void setDateFin(String dateFin) {
        this.dateFin = dateFin;
    }

    public List<EvaluationDTO> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(List<EvaluationDTO> evaluations) {
        this.evaluations = evaluations;
    }

    public List<CompetenceDTO> getCompetences() {
        return competences;
    }

    public void setCompetences(List<CompetenceDTO> competences) {
        this.competences = competences;
    }

    public String getStageDescription() {
        return stageDescription;
    }

    public void setStageDescription(String stageDescription) {
        this.stageDescription = stageDescription;
    }

    public String getStageObjectif() {
        return stageObjectif;
    }

    public void setStageObjectif(String stageObjectif) {
        this.stageObjectif = stageObjectif;
    }
}