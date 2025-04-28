package org.example.backend.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity

@NoArgsConstructor
@AllArgsConstructor
public class StageAnnee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String anneeUniversitaire;
    private String Description;
    private String Regles;

    @OneToMany(mappedBy = "stageAnnee")
    private Set<Stage> stages;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnneeUniversitaire() {
        return anneeUniversitaire;
    }

    public void setAnneeUniversitaire(String anneeUniversitaire) {
        this.anneeUniversitaire = anneeUniversitaire;
    }

    public Set<Stage> getStages() {
        return stages;
    }

    public void setStages(Set<Stage> stages) {
        this.stages = stages;
    }

    public String getDescription() {
        return Description;
    }
    public void setDescription(String description) {
        Description = description;
    }
    public String getRegles() {
        return Regles;
    }
    public void setRegles(String regles) {
        Regles = regles;
    }
}