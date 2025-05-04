package org.example.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

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