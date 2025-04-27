package org.example.backend.dto;


import lombok.*;
import java.time.LocalDate;


@NoArgsConstructor
@AllArgsConstructor
public class PeriodeDTO {
    private Long idStage;
    private Long idStagiaire;
    private LocalDate dateDebut;
    private LocalDate dateFin;

    public Long getIdStage() {
        return idStage;
    }

    public void setIdStage(Long idStage) {
        this.idStage = idStage;
    }

    public Long getIdStagiaire() {
        return idStagiaire;
    }

    public void setIdStagiaire(Long idStagiaire) {
        this.idStagiaire = idStagiaire;
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