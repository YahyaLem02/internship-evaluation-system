package org.example.backend.dto;


import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppreciationDTO {
    private Long idTuteur;
    private Long idPeriode;
    private Set<Long> evaluationIds; // IDs of related evaluations
    private Set<Long> competenceIds; // IDs of related competences
}