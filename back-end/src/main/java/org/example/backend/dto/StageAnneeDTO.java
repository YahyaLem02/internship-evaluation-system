package org.example.backend.dto;


import lombok.*;
import java.util.Set;



public class StageAnneeDTO {
    private Long id;
    private String anneeUniversitaire;
    private Set<Long> stageIds; // IDs of related stages
    private String description;
    private String regles;

    // Constructor with all arguments
    public StageAnneeDTO(Long id, String anneeUniversitaire, Set<Long> stageIds, String description, String regles) {
        this.id = id;
        this.anneeUniversitaire = anneeUniversitaire;
        this.stageIds = stageIds;
        this.description = description;
        this.regles = regles;
    }
    // Default constructor
    public StageAnneeDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnneeUniversitaire() {
        return anneeUniversitaire;
    }

    public void setAnneeUniversitaire(String anneeUniversitaire) {
        this.anneeUniversitaire = anneeUniversitaire;
    }

    public Set<Long> getStageIds() {
        return stageIds;
    }

    public void setStageIds(Set<Long> stageIds) {
        this.stageIds = stageIds;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getRegles() {
        return regles;
    }
    public void setRegles(String regles) {
        this.regles = regles;
    }

}