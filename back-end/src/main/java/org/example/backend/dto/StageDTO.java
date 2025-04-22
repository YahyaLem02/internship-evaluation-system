package org.example.backend.dto;


import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StageDTO {
    private Long id;
    private String description;
    private String objectif;
    private String entreprise;
    private Long stageAnneeId; // ID of the related StageAnnee
    private Set<Long> stagiaireIds; // IDs of related stagiaires
}