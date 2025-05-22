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

    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AdminDTO getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));
        return convertToDTO(admin);
    }

    @Transactional
    public void createAdmin(AdminDTO adminDTO) {
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


    @Transactional
    public AdminDTO updateAdmin(Long id, AdminDTO adminDTO) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));

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

    @Transactional
    public void changePassword(Long id, String currentPassword, String newPassword) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));

        if (!passwordEncoder.matches(currentPassword, admin.getMotDePasse())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        admin.setMotDePasse(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);
    }

    @Transactional
    public void deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Administrateur non trouvé");
        }
        adminRepository.deleteById(id);
    }


    private AdminDTO convertToDTO(Admin admin) {
        AdminDTO dto = new AdminDTO();
        dto.setNom(admin.getNom());
        dto.setPrenom(admin.getPrenom());
        dto.setEmail(admin.getEmail());
        dto.setRole("ADMIN");
        return dto;
    }
}