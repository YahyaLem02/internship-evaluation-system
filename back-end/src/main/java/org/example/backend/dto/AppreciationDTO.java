package org.example.backend.dto;

import java.util.Set;

public class AppreciationDTO {
    private Long id;
    private Long tuteurId;
    private Long stagiaireId;
    private Long stageId;
    private Set<Long> evaluationIds;
    private Set<Long> competenceIds;

    public AppreciationDTO(Long id, Long tuteurId, Long stagiaireId, Long stageId, Set<Long> evaluationIds, Set<Long> competenceIds) {
        this.id = id;
        this.tuteurId = tuteurId;
        this.stagiaireId = stagiaireId;
        this.stageId = stageId;
        this.evaluationIds = evaluationIds;
        this.competenceIds = competenceIds;
    }

    public AppreciationDTO() {}

    public AppreciationDTO(Long id, String nom, String prenom, String email) {
        this.id = id;
        this.tuteurId = tuteurId;
        this.stagiaireId = stagiaireId;
        this.stageId = stageId;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTuteurId() {
        return tuteurId;
    }

    public void setTuteurId(Long tuteurId) {
        this.tuteurId = tuteurId;
    }

    public Long getStagiaireId() {
        return stagiaireId;
    }

    public void setStagiaireId(Long stagiaireId) {
        this.stagiaireId = stagiaireId;
    }

    public Long getStageId() {
        return stageId;
    }

    public void setStageId(Long stageId) {
        this.stageId = stageId;
    }

    public Set<Long> getEvaluationIds() {
        return evaluationIds;
    }

    public void setEvaluationIds(Set<Long> evaluationIds) {
        this.evaluationIds = evaluationIds;
    }

    public Set<Long> getCompetenceIds() {
        return competenceIds;
    }

    public void setCompetenceIds(Set<Long> competenceIds) {
        this.competenceIds = competenceIds;
    }
}