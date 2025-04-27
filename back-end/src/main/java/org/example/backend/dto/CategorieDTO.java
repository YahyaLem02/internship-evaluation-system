package org.example.backend.dto;


import lombok.*;


public class CategorieDTO {
    private Long id;
    private String intitule;
    private String valeur;
    private Long competenceId; // ID of the related competence

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public CategorieDTO(Long id, String intitule, String valeur, Long competenceId) {
        this.id = id;
        this.intitule = intitule;
        this.valeur = valeur;
        this.competenceId = competenceId;
    }
    public CategorieDTO() {
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }

    public Long getCompetenceId() {
        return competenceId;
    }

    public void setCompetenceId(Long competenceId) {
        this.competenceId = competenceId;
    }
}