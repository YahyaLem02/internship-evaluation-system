package org.example.backend.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity

public class Tuteur extends Personne {
    private String entreprise;



    @OneToMany(mappedBy = "tuteur")
    private Set<Appreciation> appreciations;

    public Tuteur() {
        super();
    }
    public Tuteur(String nom, String prenom, String email, String telephone, String entreprise) {
        super(nom, prenom, email, telephone);
        this.entreprise = entreprise;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public Set<Appreciation> getAppreciations() {
        return appreciations;
    }


    public void setAppreciations(Set<Appreciation> appreciations) {
        this.appreciations = appreciations;
    }
}
