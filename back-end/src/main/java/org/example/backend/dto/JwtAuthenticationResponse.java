package org.example.backend.dto;

public class JwtAuthenticationResponse {
    private String token;
    private Long userId;
    private String email;
    private String nom;
    private String prenom;
    private String role;

    private Boolean isSuperAdmin = false;

    // Constructeurs
    public JwtAuthenticationResponse() {
    }

    public JwtAuthenticationResponse(String token) {
        this.token = token;
    }
    public JwtAuthenticationResponse(String token, Long userId, String email, String nom, String prenom, String role) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.role = role;
    }
    public JwtAuthenticationResponse(String token, Long userId, String email, String nom, String prenom, String role, Boolean isSuperAdmin) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.role = role;
        this.isSuperAdmin = isSuperAdmin;
    }
    // Getters et setters
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
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
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public Boolean getSuperAdmin() {
        return isSuperAdmin;
    }
    public void setSuperAdmin(Boolean superAdmin) {
        isSuperAdmin = superAdmin;
    }


    // ...
}