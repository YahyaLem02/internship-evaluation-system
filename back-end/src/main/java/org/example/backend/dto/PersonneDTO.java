package org.example.backend.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonneDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
}