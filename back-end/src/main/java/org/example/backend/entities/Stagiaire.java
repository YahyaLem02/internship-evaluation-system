package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity

public class Stagiaire extends Personne {
    private String institution;
    private String NoEncodedPassword;


    // Relation avec Periode
    @OneToMany(mappedBy = "stagiaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Periode> periodes;



    public Stagiaire() {
        super();
        setRole(Role.STAGIAIRE);
    }

    public Stagiaire(String nom, String prenom, String email, String motDePasse, String institution) {
        super(nom, prenom, email, motDePasse);
        this.institution = institution;
        setRole(Role.STAGIAIRE);
    }
    public Stagiaire(String nom, String prenom, String email, String motDePasse, String institution,String NoEncodedPassword) {
        super(nom, prenom, email, motDePasse);
        this.institution = institution;
        this.NoEncodedPassword = NoEncodedPassword;
        setRole(Role.STAGIAIRE);
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