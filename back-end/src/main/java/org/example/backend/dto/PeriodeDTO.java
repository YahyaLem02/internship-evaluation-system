package org.example.backend.dto;


import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PeriodeDTO {
    private Long idStage;
    private Long idStagiaire;
    private LocalDate dateDebut;
    private LocalDate dateFin;
}