package org.example.backend.security;

import org.example.backend.dto.JwtAuthenticationResponse;
import org.example.backend.dto.SignInRequest;
import org.example.backend.entities.Admin;
import org.example.backend.entities.Role;
import org.example.backend.entities.Stagiaire;
import org.example.backend.repositories.AdminRepository;
import org.example.backend.repositories.StagaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StagaireRepository stagiaireRepository;

    public JwtAuthenticationResponse signIn(SignInRequest request) {
        try {
            // Authentifier l'utilisateur
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Générer le token
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtService.generateToken(userDetails);

            // Créer la réponse
            JwtAuthenticationResponse response = new JwtAuthenticationResponse(token);

            // Ajouter des informations supplémentaires
            Optional<Admin> adminOpt = adminRepository.findByEmail(request.getEmail());
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                response.setUserId(admin.getId());
                response.setEmail(admin.getEmail());
                response.setNom(admin.getNom());
                response.setPrenom(admin.getPrenom());
                response.setRole("ADMIN");
                response.setSuperAdmin(admin.isSuperAdmin());
            } else {
                Optional<Stagiaire> stagiaireOpt = stagiaireRepository.findByEmail(request.getEmail());
                if (stagiaireOpt.isPresent()) {
                    Stagiaire stagiaire = new Stagiaire(
                            stagiaireOpt.get().getNom(),
                            stagiaireOpt.get().getPrenom(),
                            stagiaireOpt.get().getEmail(),
                            stagiaireOpt.get().getMotDePasse(),
                            stagiaireOpt.get().getInstitution()
                    );
                    stagiaire.setId(stagiaireOpt.get().getId()); // Copy the ID
                    stagiaire.setRole(Role.STAGIAIRE); // Explicitly set the role
                    response.setUserId(stagiaire.getId());
                    response.setEmail(stagiaire.getEmail());
                    response.setNom(stagiaire.getNom());
                    response.setPrenom(stagiaire.getPrenom());
                    response.setRole("STAGIAIRE");
                }
            }

            return response;

        } catch (Exception e) {
            System.err.println("Erreur d'authentification: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }


}