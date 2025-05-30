package org.example.backend.dto;


import lombok.*;
import java.util.Set;


@AllArgsConstructor
public class StagiaireDTO extends PersonneDTO {
    private String institution;
    private Set<Long> stageIds;
    public StagiaireDTO(Long id, String nom, String prenom, String email, String motDePasse, String institution, Set<Long> stageIds) {
        super(id, nom, prenom, email, motDePasse);
        this.institution = institution;
        this.stageIds = stageIds;
    }
public StagiaireDTO(Long id, String nom, String prenom, String email, String institution) {
    super(id, nom, prenom, email, null);
    this.institution = institution;
    this.stageIds = null;
}

    public StagiaireDTO() {
        super();
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Set<Long> getStageIds() {
        return stageIds;
    }

    public void setStageIds(Set<Long> stageIds) {
        this.stageIds = stageIds;
    }
}