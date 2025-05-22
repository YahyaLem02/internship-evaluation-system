package org.example.backend.security;

import org.example.backend.entities.Admin;
import org.example.backend.entities.Personne;
import org.example.backend.entities.Role;
import org.example.backend.entities.Stagiaire;
import org.example.backend.repositories.AdminRepository;
import org.example.backend.repositories.StagaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StagaireRepository stagiaireRepository;

    @Override
    public UserDetails loadUserByUsername(String userIdentifier) throws UsernameNotFoundException {
        System.out.println("Chargement de l'utilisateur avec l'identifiant: " + userIdentifier);

        try {
            if (userIdentifier.matches("\\d+")) {
                Long id = Long.parseLong(userIdentifier);
                System.out.println("Recherche par ID: " + id);

                Optional<Admin> adminById = adminRepository.findById(id);
                if (adminById.isPresent()) {
                    Admin admin = adminById.get();
                    System.out.println("Admin trouvé par ID: " + admin.getId() + ", " + admin.getEmail());

                    return new User(
                            String.valueOf(admin.getId()),
                            admin.getMotDePasse(),
                            Collections.singleton(new SimpleGrantedAuthority(admin.getRole().toString()))
                    );
                }

                Optional<Stagiaire> stagiaireById = stagiaireRepository.findById(id);
                if (stagiaireById.isPresent()) {
                    Stagiaire stagiaire = stagiaireById.get();
                    System.out.println("Stagiaire trouvé par ID: " + stagiaire.getId() + ", " + stagiaire.getEmail());

                    return new User(
                            String.valueOf(stagiaire.getId()),
                            stagiaire.getMotDePasse(),
                            Collections.singleton(new SimpleGrantedAuthority(stagiaire.getRole().toString()))
                    );
                }

                throw new UsernameNotFoundException("Utilisateur non trouvé avec l'ID: " + id);
            } else {
                System.out.println("Recherche par email: " + userIdentifier);

                Optional<Admin> adminByEmail = adminRepository.findByEmail(userIdentifier);
                if (adminByEmail.isPresent()) {
                    Admin admin = adminByEmail.get();
                    System.out.println("Admin trouvé par email: " + admin.getId() + ", " + admin.getEmail());

                    return new User(
                            String.valueOf(admin.getId()),
                            admin.getMotDePasse(),
                            Collections.singleton(new SimpleGrantedAuthority(admin.getRole().toString()))
                    );
                }

                Optional<Stagiaire> stagiaireByEmail = stagiaireRepository.findByEmail(userIdentifier);
                if (stagiaireByEmail.isPresent()) {
                    Stagiaire stagiaire = stagiaireByEmail.get();
                    System.out.println("Stagiaire trouvé par email: " + stagiaire.getId() + ", " + stagiaire.getEmail());

                    return new User(
                            String.valueOf(stagiaire.getId()),
                            stagiaire.getMotDePasse(),
                            Collections.singleton(new SimpleGrantedAuthority(stagiaire.getRole().toString()))
                    );
                }

                throw new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + userIdentifier);
            }
        } catch (NumberFormatException e) {
            System.out.println("Format d'identifiant non reconnu: " + userIdentifier);
            throw new UsernameNotFoundException("Format d'identifiant non reconnu: " + userIdentifier);
        }
    }
}