package org.example.backend.dto;


import lombok.*;
import java.util.Set;


@NoArgsConstructor
@AllArgsConstructor
public class StageAnneeDTO {
    private Long id;
    private String anneeUniversitaire;
    private Set<Long> stageIds; // IDs of related stages

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