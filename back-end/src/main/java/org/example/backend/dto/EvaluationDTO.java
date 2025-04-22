package org.example.backend.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationDTO {
    private Long id;
    private String categorie;
    private String valeur;
    private Long appreciationId; // ID of the related appreciation
}