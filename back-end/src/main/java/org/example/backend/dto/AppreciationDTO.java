package org.example.backend.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppreciationDTO {
    private Long id;
    private Long tuteurId;
    private Long stagiaireId;
    private Long stageId;

    private Set<Long> evaluationIds;
    private Set<Long> competenceIds;
}
