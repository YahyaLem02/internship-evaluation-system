package org.example.backend.services;

import org.example.backend.dto.AdminDTO;
import org.example.backend.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class AdminService {
    @Autowired
    private AdminRepository adminRepository;


}
