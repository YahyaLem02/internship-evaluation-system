package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity

public class Stagiaire extends Personne {
    private String institution;

    // Relation avec Periode
    @OneToMany(mappedBy = "stagiaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Periode> periodes;

    public Stagiaire(String nom, String prenom, String email, String telephone, String institution) {
        super(nom, prenom, email, telephone);
        this.institution = institution;
    }
    public Stagiaire() {
        super();
    }
    public Stagiaire(String nom, String prenom, String email, String telephone) {
        super(nom, prenom, email, telephone);
    }
    public Stagiaire(String nom, String prenom, String email, String telephone, String institution, Set<Periode> periodes) {
        super(nom, prenom, email, telephone);
        this.institution = institution;
        this.periodes = periodes;
    }


    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Set<Periode> getPeriodes() {
        return periodes;
    }

    public void setPeriodes(Set<Periode> periodes) {
        this.periodes = periodes;
    }

}