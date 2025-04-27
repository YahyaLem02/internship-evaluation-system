package org.example.backend.dto;


import lombok.*;
import java.util.Set;



public class StageDTO {
    private Long id;
    private String description;
    private String objectif;
    private String entreprise;
    private Long stageAnneeId; // ID of the related StageAnnee
    private Set<Long> stagiaireIds; // IDs of related stagiaires
    // Constructor with all arguments
    public StageDTO(Long id, String description, String objectif, String entreprise, Long stageAnneeId, Set<Long> stagiaireIds) {
        this.id = id;
        this.description = description;
        this.objectif = objectif;
        this.entreprise = entreprise;
        this.stageAnneeId = stageAnneeId;
        this.stagiaireIds = stagiaireIds;
    }
    // Default constructor
    public StageDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectif() {
        return objectif;
    }

    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public Long getStageAnneeId() {
        return stageAnneeId;
    }

    public void setStageAnneeId(Long stageAnneeId) {
        this.stageAnneeId = stageAnneeId;
    }

    public Set<Long> getStagiaireIds() {
        return stagiaireIds;
    }

    public void setStagiaireIds(Set<Long> stagiaireIds) {
        this.stagiaireIds = stagiaireIds;
    }
}