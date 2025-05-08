package org.example.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Periode {

    @EmbeddedId
    private PeriodeId id;

    @ManyToOne
    @MapsId("stagiaireId") // Relie à la clé composite
    @JoinColumn(name = "id_stagiaire")
    private Stagiaire stagiaire;

    @ManyToOne
    @MapsId("stageId") // Relie à la clé composite
    @JoinColumn(name = "id_stage")
    private Stage stage;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;
    @Column(unique = true)
    private String appreciationToken;
    // Add this to the `Periode` class
    @OneToMany(mappedBy = "periode", cascade = CascadeType.ALL)
    private List<Appreciation> appreciations;

    public List<Appreciation> getAppreciations() {
        return appreciations;
    }

    public void setAppreciations(List<Appreciation> appreciations) {
        this.appreciations = appreciations;
    }

    public String getAppreciationToken() {
        return appreciationToken;
    }
    public void setAppreciationToken(String appreciationToken) {
        this.appreciationToken = appreciationToken;
    }
    public Periode() {
    }

    public PeriodeId getId() {
        return id;
    }

    public void setId(PeriodeId id) {
        this.id = id;
    }

    public Stagiaire getStagiaire() {
        return stagiaire;
    }

    public void setStagiaire(Stagiaire stagiaire) {
        this.stagiaire = stagiaire;
    }

    public Stage getStage() {
        return stage;
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
}