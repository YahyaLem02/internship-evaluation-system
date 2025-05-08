package org.example.backend.entities;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Appreciation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "id_stagiaire", referencedColumnName = "id_stagiaire"),
            @JoinColumn(name = "id_stage", referencedColumnName = "id_stage")
    })
    private Periode periode;

    @ManyToOne
    @JoinColumn(name = "tuteur_id")
    private Tuteur tuteur;

    @OneToMany(mappedBy = "appreciation", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Evaluation> evaluations = new HashSet<>();

    @OneToMany(mappedBy = "appreciation", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Competence> competences = new HashSet<>();

    // Constructeurs
    public Appreciation() {
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Periode getPeriode() {
        return periode;
    }

    public void setPeriode(Periode periode) {
        this.periode = periode;
    }

    public Tuteur getTuteur() {
        return tuteur;
    }

    public void setTuteur(Tuteur tuteur) {
        this.tuteur = tuteur;
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

    // Méthodes utilitaires pour gérer les relations bidirectionnelles
    public void addEvaluation(Evaluation evaluation) {
        evaluations.add(evaluation);
        evaluation.setAppreciation(this);
    }

    public void removeEvaluation(Evaluation evaluation) {
        evaluations.remove(evaluation);
        evaluation.setAppreciation(null);
    }

    public void addCompetence(Competence competence) {
        competences.add(competence);
        competence.setAppreciation(this);
    }

    public void removeCompetence(Competence competence) {
        competences.remove(competence);
        competence.setAppreciation(null);
    }
}