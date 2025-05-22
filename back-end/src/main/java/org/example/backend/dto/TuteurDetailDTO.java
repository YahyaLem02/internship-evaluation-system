package org.example.backend.dto;

import java.util.List;

public class TuteurDetailDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String entreprise;
    private int nbStagiaires;
    private int nbAppreciations;
    private List<AppreciationTuteurDTO> appreciations;

    public TuteurDetailDTO() {
    }

    public TuteurDetailDTO(Long id, String nom, String prenom, String email, String entreprise,
                         int nbStagiaires, int nbAppreciations) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.entreprise = entreprise;
        this.nbStagiaires = nbStagiaires;
        this.nbAppreciations = nbAppreciations;
    }

    public TuteurDetailDTO(Long id, String nom, String prenom, String email, String entreprise,
                           int nbStagiaires, int nbAppreciations, List<AppreciationTuteurDTO> appreciations) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.entreprise = entreprise;
        this.nbStagiaires = nbStagiaires;
        this.nbAppreciations = nbAppreciations;
        this.appreciations = appreciations;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public int getNbStagiaires() {
        return nbStagiaires;
    }

    public void setNbStagiaires(int nbStagiaires) {
        this.nbStagiaires = nbStagiaires;
    }

    public int getNbAppreciations() {
        return nbAppreciations;
    }

    public void setNbAppreciations(int nbAppreciations) {
        this.nbAppreciations = nbAppreciations;
    }
}