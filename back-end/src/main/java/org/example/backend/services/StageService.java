package org.example.backend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.example.backend.dto.*;
import org.example.backend.entities.*;
import org.example.backend.repositories.PeriodeRepository;
import org.example.backend.repositories.StagaireRepository;
import org.example.backend.repositories.StageAnneeRepository;
import org.example.backend.repositories.StageRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StageService {

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private StageAnneeRepository stageAnneeRepository;

    @Autowired
    private StagaireRepository stagiaireRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PeriodeRepository periodeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JavaMailSender mailSender;

    public List<StageDTO> getAllStages() {
        return stageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StageDTO getStageById(Long id) {
        Stage stage = stageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stage not found"));
        return convertToDTO(stage);
    }

    public StageDTO createStage(StageDTO dto) {
        Stage stage = new Stage();
        stage.setDescription(dto.getDescription());
        stage.setObjectif(dto.getObjectif());
        stage.setEntreprise(dto.getEntreprise());

        if (dto.getStageAnneeId() != null) {
            StageAnnee stageAnnee = stageAnneeRepository.findById(dto.getStageAnneeId())
                    .orElseThrow(() -> new EntityNotFoundException("StageAnnee not found"));
            stage.setStageAnnee(stageAnnee);
        }

        Stage saved = stageRepository.save(stage);
        return modelMapper.map(saved, StageDTO.class);
    }

    public StageDTO updateStage(Long id, StageDTO dto) {
        Stage existing = stageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stage not found"));

        existing.setDescription(dto.getDescription());
        existing.setObjectif(dto.getObjectif());
        existing.setEntreprise(dto.getEntreprise());

        if (dto.getStageAnneeId() != null) {
            StageAnnee stageAnnee = stageAnneeRepository.findById(dto.getStageAnneeId())
                    .orElseThrow(() -> new EntityNotFoundException("StageAnnee not found"));
            existing.setStageAnnee(stageAnnee);
        }

        Stage updated = stageRepository.save(existing);
        return modelMapper.map(updated, StageDTO.class);
    }

    public void deleteStage(Long id) {
        stageRepository.deleteById(id);
    }

    private StageDTO convertToDTO(Stage stage) {
        StageDTO dto = modelMapper.map(stage, StageDTO.class);
        if (stage.getPeriodes() != null) {
            Set<Long> stagiaireIds = stage.getPeriodes().stream()
                    .map(periode -> periode.getStagiaire().getId())
                    .collect(Collectors.toSet());
            dto.setStagiaireIds(stagiaireIds);
        }
        return dto;
    }

    @Transactional
    public StageDTO createStageViaShareLink(StageCreateDTO dto) {
        // 1. Find the StageAnnee via the token
        StageAnnee sa = stageAnneeRepository.findByShareToken(dto.getShareToken())
                .orElseThrow(() -> new RuntimeException("Invalid link"));

        // 2. Create the Stagiaire
        String generatedPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String encodedPassword = passwordEncoder.encode(generatedPassword);
        dto.setMotDePasse(encodedPassword);

        Stagiaire stagiaire = new Stagiaire(
                dto.getNom(), dto.getPrenom(), dto.getEmail(), dto.getMotDePasse(), dto.getInstitution(),generatedPassword
        );
        stagiaire = stagiaireRepository.save(stagiaire);

        // 3. Create the Stage associated with StageAnnee
        Stage stage = new Stage();
        stage.setDescription(dto.getDescription());
        stage.setObjectif(dto.getObjectif());
        stage.setEntreprise(dto.getEntreprise());
        stage.setStageAnnee(sa);
        stage = stageRepository.save(stage);

        // 4. Create and save the Periode
        PeriodeId periodeId = new PeriodeId(stagiaire.getId(), stage.getId());
        if (!periodeRepository.existsById(periodeId)) {
            Periode periode = new Periode();
            periode.setId(periodeId);
            periode.setStagiaire(stagiaire);
            periode.setStage(stage);
            periode.setDateDebut(dto.getDateDebut());
            periode.setDateFin(dto.getDateFin());
            periode.setAppreciationToken(UUID.randomUUID().toString());
            System.out.println("Periode avant sauvegarde : " + periode);
            periodeRepository.save(periode);
            System.out.println("Periode après sauvegarde : " + periode);
        }
        // 5. Envoyer un email au stagiaire avec ses identifiants
        try {
            sendWelcomeEmail(stagiaire, generatedPassword, stage);
        } catch (Exception e) {
            // Log l'erreur mais continuer le processus
            System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
            e.printStackTrace();
        }

        // 5. Return the DTO
        return convertToDTO(stage);
    }
    private void sendWelcomeEmail(Stagiaire stagiaire, String plainPassword, Stage stage) throws MessagingException {
        // Création d'un message MIME avec support HTML
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Configurer l'email
        helper.setTo(stagiaire.getEmail());
        helper.setSubject("Bienvenue sur EvalStage - Vos identifiants de connexion");

        // Date actuelle formatée
        String currentDate = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

        // Construction du contenu HTML
        String htmlContent =
                "<html>" +
                        "<head>" +
                        "  <style>" +
                        "    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                        "    .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                        "    .header { background-color: #41729F; color: white; padding: 15px 20px; text-align: center; border-radius: 5px 5px 0 0; }" +
                        "    .content { padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }" +
                        "    .credentials { background-color: #fff; padding: 15px; border-left: 4px solid #41729F; margin: 15px 0; }" +
                        "    .btn { display: inline-block; background-color: #41729F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }" +
                        "    .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }" +
                        "  </style>" +
                        "</head>" +
                        "<body>" +
                        "  <div class='container'>" +
                        "    <div class='header'>" +
                        "      <h2>Bienvenue sur EvalStage</h2>" +
                        "    </div>" +
                        "    <div class='content'>" +
                        "      <p>Bonjour <strong>" + stagiaire.getPrenom() + " " + stagiaire.getNom() + "</strong>,</p>" +
                        "      <p>Votre compte a été créé avec succès sur notre plateforme d'évaluation de stage.</p>" +
                        "      <p>Vous pouvez dès à présent vous connecter à votre espace personnel pour consulter les informations " +
                        "         concernant votre stage chez <strong>" + stage.getEntreprise() + "</strong> et vos appréciations.</p>" +
                        "      <div class='credentials'>" +
                        "        <h3>Vos identifiants de connexion</h3>" +
                        "        <p><strong>Email :</strong> " + stagiaire.getEmail() + "</p>" +
                        "        <p><strong>Mot de passe :</strong> " + plainPassword + "</p>" +
                        "      </div>" +
                        "      <p>Nous vous recommandons de changer votre mot de passe après votre première connexion.</p>" +
                        "      <p style='text-align:center;'><a href='http://localhost:5173/login' class='btn'>Se connecter maintenant</a></p>" +
                        "    </div>" +
                        "    <div class='footer'>" +
                        "      <p>Cet email a été envoyé le " + currentDate + "</p>" +
                        "      <p>Si vous n'êtes pas à l'origine de cette inscription, veuillez ignorer cet email.</p>" +
                        "      <p>© " + java.time.Year.now().getValue() + " EvalStage - Tous droits réservés</p>" +
                        "    </div>" +
                        "  </div>" +
                        "</body>" +
                        "</html>";

        // Définir le contenu HTML
        helper.setText(htmlContent, true);

        // Envoyer l'email
        mailSender.send(message);

        System.out.println("Email de bienvenue envoyé à " + stagiaire.getEmail());
    }


}