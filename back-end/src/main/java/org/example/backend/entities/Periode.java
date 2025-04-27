package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
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
}