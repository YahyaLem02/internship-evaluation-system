package org.example.backend.dto;

public class PasswordChangeRequest {
    private String currentPassword;
    private String newPassword;

    // Constructeur par défaut
    public PasswordChangeRequest() {
    }

    // Getters et setters
    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}