package org.example.backend.dto;

import java.util.List;

public class StageDetailDTO {
    private Long id;
    private String entreprise;
    private String description;
    private String objectif;
    private String dateDebut;
    private String dateFin;
    private Long stageAnneeId;
    private String anneeUniversitaire;
    private boolean evaluated;
    private List<AppreciationDisplayDto> appreciations;

    // Constructeur par défaut pour Jackson
    public StageDetailDTO() {
    }

    // Constructeur complet
    public StageDetailDTO(Long id, String entreprise, String description, String objectif,
                          String dateDebut, String dateFin, Long stageAnneeId,
                          String anneeUniversitaire, boolean evaluated, List<AppreciationDisplayDto> appreciations) {
        this.id = id;
        this.entreprise = entreprise;
        this.description = description;
        this.objectif = objectif;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.stageAnneeId = stageAnneeId;
        this.anneeUniversitaire = anneeUniversitaire;
        this.evaluated = evaluated;
        this.appreciations = appreciations;
    }

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectif() {
        return objectif;
    }

    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }

    public String getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(String dateDebut) {
        this.dateDebut = dateDebut;
    }

    public String getDateFin() {
        return dateFin;
    }

    public void setDateFin(String dateFin) {
        this.dateFin = dateFin;
    }

    public Long getStageAnneeId() {
        return stageAnneeId;
    }

    public void setStageAnneeId(Long stageAnneeId) {
        this.stageAnneeId = stageAnneeId;
    }

    public String getAnneeUniversitaire() {
        return anneeUniversitaire;
    }

    public void setAnneeUniversitaire(String anneeUniversitaire) {
        this.anneeUniversitaire = anneeUniversitaire;
    }

    public boolean isEvaluated() {
        return evaluated;
    }

    public void setEvaluated(boolean evaluated) {
        this.evaluated = evaluated;
    }

    public List<AppreciationDisplayDto> getAppreciations() {
        return appreciations;
    }

    public void setAppreciations(List<AppreciationDisplayDto> appreciations) {
        this.appreciations = appreciations;
    }
}