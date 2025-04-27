package org.example.backend.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity

@NoArgsConstructor
@AllArgsConstructor
public class Stage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String objectif;
    private String entreprise;

    @ManyToOne
    private StageAnnee stageAnnee;

    @ManyToMany
    @JoinTable(
            name = "periode",
            joinColumns = @JoinColumn(name = "id_stage"),
            inverseJoinColumns = @JoinColumn(name = "id_stagiaire")
    )
    private Set<Stagiaire> stagiaires;
    @OneToMany(mappedBy = "stage")
    private Set<Periode> periodes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectif() {
        return objectif;
    }

    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public StageAnnee getStageAnnee() {
        return stageAnnee;
    }

    public void setStageAnnee(StageAnnee stageAnnee) {
        this.stageAnnee = stageAnnee;
    }

    public Set<Stagiaire> getStagiaires() {
        return stagiaires;
    }

    public void setStagiaires(Set<Stagiaire> stagiaires) {
        this.stagiaires = stagiaires;
    }

    public Set<Periode> getPeriodes() {
        return periodes;
    }

    public void setPeriodes(Set<Periode> periodes) {
        this.periodes = periodes;
    }
}