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
}