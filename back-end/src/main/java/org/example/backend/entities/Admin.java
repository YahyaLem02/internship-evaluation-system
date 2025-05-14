package org.example.backend.entities;

import jakarta.persistence.Entity;
import lombok.*;

@Entity

public class Admin extends Personne {

    boolean isSuperAdmin = false;


    public Admin() {
        super();
        setRole(Role.ADMIN);
    }

    public Admin(String nom, String prenom, String email, String motDePasse, String role) {
        super(nom, prenom, email, motDePasse);
        this.setRole(Role.valueOf(role));
    }

    public Admin(String nom, String prenom, String email, String motDePasse, Role role) {
        super(nom, prenom, email, motDePasse);
        this.setRole(role);
    }



    public boolean isSuperAdmin() {
        return isSuperAdmin;
    }
    public void setSuperAdmin(boolean isSuperAdmin) {
        this.isSuperAdmin = isSuperAdmin;
    }






}
