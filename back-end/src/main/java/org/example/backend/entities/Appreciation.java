package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Appreciation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_tuteur")
    private Tuteur tuteur;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "stagiaire_id", referencedColumnName = "id_stagiaire"),
            @JoinColumn(name = "stage_id", referencedColumnName = "id_stage")
    })
    private Periode periode;

    @OneToMany(mappedBy = "appreciation")
    private Set<Evaluation> evaluations;

    @OneToMany(mappedBy = "appreciation")
    private Set<Competence> competences;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tuteur getTuteur() {
        return tuteur;
    }

    public void setTuteur(Tuteur tuteur) {
        this.tuteur = tuteur;
    }

    public Periode getPeriode() {
        return periode;
    }

    public void setPeriode(Periode periode) {
        this.periode = periode;
    }

    public Set<Evaluation> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(Set<Evaluation> evaluations) {
        this.evaluations = evaluations;
    }

    public Set<Competence> getCompetences() {
        return competences;
    }

    public void setCompetences(Set<Competence> competences) {
        this.competences = competences;
    }
}