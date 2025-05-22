package org.example.backend.dto;


import lombok.*;
import java.util.Set;



public class TuteurDTO extends PersonneDTO {
    private String entreprise;

    private Set<Long> appreciationIds;
    public TuteurDTO(Long id, String nom, String prenom, String email, String motDePasse, String entreprise, Set<Long> appreciationIds) {
        super(id, nom, prenom, email, motDePasse);
        this.entreprise = entreprise;
        this.appreciationIds = appreciationIds;
    }
    public TuteurDTO() {
        super();
    }

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