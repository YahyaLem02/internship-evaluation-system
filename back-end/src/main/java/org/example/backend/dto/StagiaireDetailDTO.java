package org.example.backend.dto;


import java.util.List;

public class StagiaireDetailDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String institution;
    private String entreprise; // Entreprise associée au stage
    private String dateDebut; // Période de début
    private String dateFin;   // Période de fin
    private String appreciationToken;
    private List<AppreciationDisplayDto> appreciations;

    private List<StageDetailDTO> stages;
    private boolean evaluated;







    public StagiaireDetailDTO() {
    }
    public StagiaireDetailDTO(Long id, String nom, String prenom, String email, String institution, String entreprise, String dateDebut, String dateFin, String appreciationToken) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.institution = institution;
        this.entreprise = entreprise;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.appreciationToken = appreciationToken;
    }
    public StagiaireDetailDTO(Long id, String nom, String prenom, String email, String institution, String entreprise, String dateDebut, String dateFin, String appreciationToken, List<AppreciationDisplayDto> appreciations) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.institution = institution;
        this.entreprise = entreprise;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.appreciationToken = appreciationToken;
        this.appreciations = appreciations;
    }

    public StagiaireDetailDTO(Long id, String nom, String prenom, String email, String institution, List<StageDetailDTO> stages, boolean evaluated) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.institution = institution;
        this.stages = stages;
        this.evaluated = evaluated;
    }
    public boolean isEvaluated() {
        return evaluated;
    }

    public void setEvaluated(boolean evaluated) {
        this.evaluated = evaluated;
    }
    public StagiaireDetailDTO(Long id, String nom, String prenom, String email, String institution, String entreprise, String dateDebut, String dateFin, String appreciationToken, boolean evaluated) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.institution = institution;
        this.entreprise = entreprise;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.appreciationToken = appreciationToken;
        this.evaluated = evaluated;
    }
    public StagiaireDetailDTO(Long id, String nom, String prenom, String email, String institution, String entreprise, String dateDebut, String dateFin, String appreciationToken, List<AppreciationDisplayDto> appreciations, boolean evaluated) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.institution = institution;
    this.entreprise = entreprise;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.appreciationToken = appreciationToken;
    this.appreciations = appreciations;
    this.evaluated = evaluated;
}
    public StagiaireDetailDTO(Long id, String nom, String prenom, String email,
                              String institution, String entreprise,
                              String dateDebut, String dateFin,
                              String appreciationToken,
                              List<AppreciationDisplayDto> appreciations,
                              List<StageDetailDTO> stages, boolean evaluated) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.institution = institution;
        this.entreprise = entreprise;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.appreciationToken = appreciationToken;
        this.appreciations = appreciations;
        this.stages = stages;
        this.evaluated = evaluated;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getPrenom() {
        return prenom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getInstitution() {
        return institution;
    }
    public void setInstitution(String institution) {
        this.institution = institution;
    }
    public String getEntreprise() {
        return entreprise;
    }
    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
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
    public String getAppreciationToken() {
        return appreciationToken;
    }
    public void setAppreciationToken(String appreciationToken) {
        this.appreciationToken = appreciationToken;
    }
    public List<AppreciationDisplayDto> getAppreciations() {
        return appreciations;
    }
    public void setAppreciations(List<AppreciationDisplayDto> appreciations) {
        this.appreciations = appreciations;
    }


}