package org.example.backend.services;

import org.example.backend.dto.AdminDTO;
import org.example.backend.entities.Admin;
import org.example.backend.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Récupère tous les administrateurs
     * @return Une liste de tous les administrateurs
     */
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupère un administrateur par son ID
     * @param id L'ID de l'administrateur à récupérer
     * @return Les informations de l'administrateur
     */
    public AdminDTO getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));
        return convertToDTO(admin);
    }

    /**
     * Crée un nouvel administrateur
     * @param adminDTO Les informations du nouvel administrateur
     */
    @Transactional
    public void createAdmin(AdminDTO adminDTO) {
        // Vérifier si l'email existe déjà
        if (adminRepository.findByEmail(adminDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Admin admin = new Admin();
        admin.setNom(adminDTO.getNom());
        admin.setPrenom(adminDTO.getPrenom());
        admin.setEmail(adminDTO.getEmail());
        admin.setMotDePasse(passwordEncoder.encode(adminDTO.getMotDePasse()));

        adminRepository.save(admin);
    }

    /**
     * Met à jour les informations d'un administrateur
     * @param id L'ID de l'administrateur à mettre à jour
     * @param adminDTO Les nouvelles informations
     * @return Les informations mises à jour
     */
    @Transactional
    public AdminDTO updateAdmin(Long id, AdminDTO adminDTO) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));

        // Vérifier si l'email est déjà utilisé par un autre administrateur
        if (!admin.getEmail().equals(adminDTO.getEmail()) &&
                adminRepository.findByEmail(adminDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé par un autre administrateur");
        }

        admin.setNom(adminDTO.getNom());
        admin.setPrenom(adminDTO.getPrenom());
        admin.setEmail(adminDTO.getEmail());

        Admin updatedAdmin = adminRepository.save(admin);
        return convertToDTO(updatedAdmin);
    }

    /**
     * Change le mot de passe d'un administrateur
     * @param id L'ID de l'administrateur
     * @param currentPassword Le mot de passe actuel
     * @param newPassword Le nouveau mot de passe
     */
    @Transactional
    public void changePassword(Long id, String currentPassword, String newPassword) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));

        // Vérifier que le mot de passe actuel est correct
        if (!passwordEncoder.matches(currentPassword, admin.getMotDePasse())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        admin.setMotDePasse(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);
    }

    /**
     * Supprime un administrateur
     * @param id L'ID de l'administrateur à supprimer
     */
    @Transactional
    public void deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Administrateur non trouvé");
        }
        adminRepository.deleteById(id);
    }

    /**
     * Convertit une entité Admin en DTO
     * @param admin L'entité Admin à convertir
     * @return Le DTO correspondant
     */
    private AdminDTO convertToDTO(Admin admin) {
        AdminDTO dto = new AdminDTO();
        dto.setNom(admin.getNom());
        dto.setPrenom(admin.getPrenom());
        dto.setEmail(admin.getEmail());
        dto.setRole("ADMIN"); // Définir le rôle explicitement
        return dto;
    }
}