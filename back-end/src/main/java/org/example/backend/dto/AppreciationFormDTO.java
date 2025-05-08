package org.example.backend.dto;
import org.example.backend.dto.CompetenceDTO;
import org.example.backend.dto.EvaluationDTO;

import java.util.List;

public class AppreciationFormDTO {
    private String token;
    private String stageDescription;
    private String stageObjectif;
    private TuteurDTO tuteur;
    private List<EvaluationDTO> evaluations;
    private List<CompetenceDTO> competences;

    // Getters et setters
    public String getToken() {
        return token;
    }


    public void setToken(String token) {
        this.token = token;
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

    public TuteurDTO getTuteur() {
        return tuteur;
    }
    public void setTuteur(TuteurDTO tuteur) {
        this.tuteur = tuteur;
    }
    // Constructeur par défaut
    public AppreciationFormDTO() {
    }
    // Constructeur avec tous les arguments
    public AppreciationFormDTO(String token, String stageDescription, String stageObjectif, List<EvaluationDTO> evaluations, List<CompetenceDTO> competences) {
        this.token = token;
        this.stageDescription = stageDescription;
        this.stageObjectif = stageObjectif;
        this.evaluations = evaluations;
        this.competences = competences;
    }
    @Override
    public String toString() {
        return "AppreciationFormDTO{" +
                "token='" + token + '\'' +
                ", stageDescription='" + stageDescription + '\'' +
                ", stageObjectif='" + stageObjectif + '\'' +
                ", evaluations=" + evaluations +
                ", competences=" + competences +
                '}';
    }
}