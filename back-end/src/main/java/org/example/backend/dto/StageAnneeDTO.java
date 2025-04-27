package org.example.backend.dto;


import lombok.*;
import java.util.Set;



public class StageAnneeDTO {
    private Long id;
    private String anneeUniversitaire;
    private Set<Long> stageIds; // IDs of related stages
    // Constructor with all arguments
    public StageAnneeDTO(Long id, String anneeUniversitaire, Set<Long> stageIds) {
        this.id = id;
        this.anneeUniversitaire = anneeUniversitaire;
        this.stageIds = stageIds;
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
}