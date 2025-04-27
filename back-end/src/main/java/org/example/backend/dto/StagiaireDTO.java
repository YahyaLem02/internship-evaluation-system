package org.example.backend.dto;


import lombok.*;
import java.util.Set;


@NoArgsConstructor
@AllArgsConstructor
public class StagiaireDTO extends PersonneDTO {
    private String institution;
    private Set<Long> stageIds; // IDs of related stages

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