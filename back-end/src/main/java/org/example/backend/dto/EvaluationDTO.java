package org.example.backend.dto;


import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
public class EvaluationDTO {
    private Long id;
    private String categorie;
    private String valeur;
    private Long appreciationId; // ID of the related appreciation

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