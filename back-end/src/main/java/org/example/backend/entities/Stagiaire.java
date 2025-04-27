package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Stagiaire extends Personne {
    private String institution;

    @ManyToMany(mappedBy = "stagiaires")
    private Set<Stage> stages;
    @OneToMany(mappedBy = "stagiaire")
    private Set<Periode> periodes;

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Set<Stage> getStages() {
        return stages;
    }

    public void setStages(Set<Stage> stages) {
        this.stages = stages;
    }

    public Set<Periode> getPeriodes() {
        return periodes;
    }

    public void setPeriodes(Set<Periode> periodes) {
        this.periodes = periodes;
    }
}