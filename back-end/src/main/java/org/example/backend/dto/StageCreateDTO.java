package org.example.backend.dto;

import lombok.*;
import java.time.LocalDate;

public class StageCreateDTO {
    private String shareToken;

    // Stagiaire infos
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private String institution;

    // Stage infos
    private String description;
    private String objectif;
    private String entreprise;

    // Periode infos
    private LocalDate dateDebut;
    private LocalDate dateFin;

    public StageCreateDTO() {}

    public StageCreateDTO(String shareToken, String nom, String prenom, String email, String motDePasse, String institution,
                          String description, String objectif, String entreprise, LocalDate dateDebut, LocalDate dateFin) {
        this.shareToken = shareToken;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.institution = institution;
        this.description = description;
        this.objectif = objectif;
        this.entreprise = entreprise;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }

    public String getShareToken() {
        return shareToken;
    }

    public void setShareToken(String shareToken) {
        this.shareToken = shareToken;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectif() {
        return objectif;
    }

    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
}