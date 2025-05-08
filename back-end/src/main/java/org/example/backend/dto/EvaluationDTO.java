package org.example.backend.dto;

import lombok.*;

public class EvaluationDTO {
    private String categorie;
    private String valeur;

    public EvaluationDTO(String categorie, String valeur) {
        this.categorie = categorie;
        this.valeur = valeur;
    }
    // Constructeur par défaut
    public EvaluationDTO() {
    }


    // Getters et setters
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

    @Override
    public String toString() {
        return "EvaluationDTO{" +
                "categorie='" + categorie + '\'' +
                ", valeur='" + valeur + '\'' +
                '}';
    }
}