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
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_stage")
    private Stage stage;

    @ManyToOne
    @JoinColumn(name = "id_stagiaire")
    private Stagiaire stagiaire;

    private LocalDate dateDebut;
    private LocalDate dateFin;
}