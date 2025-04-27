package org.example.backend.dto;


import lombok.*;



public class EvaluationDTO {
    private Long id;
    private String categorie;
    private String valeur;
    private Long appreciationId; // ID of the related appreciation

    // Constructor with all arguments

    public EvaluationDTO(Long id, String categorie, String valeur, Long appreciationId) {
        this.id = id;
        this.categorie = categorie;
        this.valeur = valeur;
        this.appreciationId = appreciationId;
    }
    // Default constructor
    public EvaluationDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }

    public Long getAppreciationId() {
        return appreciationId;
    }

    public void setAppreciationId(Long appreciationId) {
        this.appreciationId = appreciationId;
    }
}