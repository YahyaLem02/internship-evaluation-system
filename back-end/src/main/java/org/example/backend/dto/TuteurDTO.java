package org.example.backend.dto;


import lombok.*;
import java.util.Set;


@NoArgsConstructor
@AllArgsConstructor
public class TuteurDTO extends PersonneDTO {
    private String entreprise;
    private Set<Long> appreciationIds; // IDs of related appreciations

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public Set<Long> getAppreciationIds() {
        return appreciationIds;
    }

    public void setAppreciationIds(Set<Long> appreciationIds) {
        this.appreciationIds = appreciationIds;
    }
}