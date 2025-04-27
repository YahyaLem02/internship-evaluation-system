package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Periode {

    @EmbeddedId
    private PeriodeId id;

    @ManyToOne
    @MapsId("stagiaireId") // relie à la clé composite
    @JoinColumn(name = "id_stagiaire")
    private Stagiaire stagiaire;

    @ManyToOne
    @MapsId("stageId")
    @JoinColumn(name = "id_stage")
    private Stage stage;

    private LocalDate dateDebut;
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