package org.example.backend.dto;


import lombok.*;
import java.util.Set;


public class CompetenceDTO {
    private Long id;
    private String intitule;
    private String note;
    private Long appreciationId; // ID of the related appreciation
    private Set<Long> categorieIds; // IDs of related categories

    // Constructor with all arguments
    public CompetenceDTO(Long id, String intitule, String note, Long appreciationId, Set<Long> categorieIds) {
        this.id = id;
        this.intitule = intitule;
        this.note = note;
        this.appreciationId = appreciationId;
        this.categorieIds = categorieIds;
    }
    // Default constructor
    public CompetenceDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getAppreciationId() {
        return appreciationId;
    }

    public void setAppreciationId(Long appreciationId) {
        this.appreciationId = appreciationId;
    }

    public Set<Long> getCategorieIds() {
        return categorieIds;
    }

    public void setCategorieIds(Set<Long> categorieIds) {
        this.categorieIds = categorieIds;
    }
}