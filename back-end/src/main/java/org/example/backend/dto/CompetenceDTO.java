package org.example.backend.dto;

import lombok.*;
import java.util.List;

public class CompetenceDTO {
    private String intitule;
    private String note;
    private List<CategorieDTO> categories;

    public <R> CompetenceDTO(String intitule, String note, List<CategorieDTO> categories) {
        this.intitule = intitule;
        this.note = note;
        this.categories = categories;
    }

    public CompetenceDTO() {
    }


    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public List<CategorieDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<CategorieDTO> categories) {
        this.categories = categories;
    }

    @Override
    public String toString() {
        return "CompetenceDTO{" +
                "intitule='" + intitule + '\'' +
                ", note='" + note + '\'' +
                ", categories=" + categories +
                '}';
    }
}
