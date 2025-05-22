package org.example.backend.dto;

import lombok.*;

public class CategorieDTO {
    private String intitule;
    private String valeur;

    public CategorieDTO(String intitule, String valeur) {
        this.intitule = intitule;
        this.valeur = valeur;
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

    @Override
    public String toString() {
        return "CategorieDTO{" +
                "intitule='" + intitule + '\'' +
                ", valeur='" + valeur + '\'' +
                '}';
    }
}