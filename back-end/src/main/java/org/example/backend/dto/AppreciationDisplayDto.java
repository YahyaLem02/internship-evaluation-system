package org.example.backend.dto;

import java.util.List;

public class AppreciationDisplayDto {
    private Long id;
    private String tuteurNom;
    private String tuteurPrenom;
    private String tuteurEmail;
    private String tuteurEntreprise;
    private List<EvaluationDTO> evaluations;
    private List<CompetenceDTO> competences;
    private String stageDescription;
    private String stageObjectif;

    public AppreciationDisplayDto() {
    }

    public AppreciationDisplayDto(Long id, String tuteurNom, String tuteurPrenom, String tuteurEmail, String tuteurEntreprise, List<EvaluationDTO> evaluations, List<CompetenceDTO> competences, String stageDescription, String stageObjectif) {
        this.id = id;
        this.tuteurNom = tuteurNom;
        this.tuteurPrenom = tuteurPrenom;
        this.tuteurEmail = tuteurEmail;
        this.tuteurEntreprise = tuteurEntreprise;
        this.evaluations = evaluations;
        this.competences = competences;
        this.stageDescription = stageDescription;
        this.stageObjectif = stageObjectif;
    }
   public AppreciationDisplayDto(Long id, String tuteurNom, String tuteurPrenom, String tuteurEmail, String tuteurEntreprise, String stageDescription, String stageObjectif) {
    this.id = id;
    this.tuteurNom = tuteurNom;
    this.tuteurPrenom = tuteurPrenom;
    this.tuteurEmail = tuteurEmail;
    this.tuteurEntreprise = tuteurEntreprise;
    this.stageDescription = stageDescription;
    this.stageObjectif = stageObjectif;
}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTuteurNom() {
        return tuteurNom;
    }

    public void setTuteurNom(String tuteurNom) {
        this.tuteurNom = tuteurNom;
    }

    public String getTuteurPrenom() {
        return tuteurPrenom;
    }

    public void setTuteurPrenom(String tuteurPrenom) {
        this.tuteurPrenom = tuteurPrenom;
    }

    public String getTuteurEmail() {
        return tuteurEmail;
    }

    public void setTuteurEmail(String tuteurEmail) {
        this.tuteurEmail = tuteurEmail;
    }

    public String getTuteurEntreprise() {
        return tuteurEntreprise;
    }

    public void setTuteurEntreprise(String tuteurEntreprise) {
        this.tuteurEntreprise = tuteurEntreprise;
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