package org.example.backend.controllers;

import org.example.backend.dto.AdminDTO;
import org.example.backend.dto.JwtAuthenticationResponse;
import org.example.backend.dto.SignInRequest;
import org.example.backend.security.AuthenticationService;
import org.example.backend.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInRequest request) {
        try {
            System.out.println("Requête de connexion reçue pour: " + request.getEmail());

            JwtAuthenticationResponse response = authenticationService.signIn(request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Erreur lors de la connexion: " + e.getMessage());

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminDTO request) {
        try {
            adminService.createAdmin(request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/admins")
    public ResponseEntity<?> getAllAdmins() {
        try {
            return ResponseEntity.ok(adminService.getAllAdmins());
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Endpoint de test accessible");
        response.put("timestamp", new Date().toString());
        return ResponseEntity.ok(response);
    }
}