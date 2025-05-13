package org.example.backend.dto;

public class VerificationCodeRequest {
    private String email;
    private String nom;
    private String prenom;
    private String code;


    public VerificationCodeRequest() {
    }
    public VerificationCodeRequest(String email, String nom, String prenom, String code) {
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.code = code;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
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
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

}
