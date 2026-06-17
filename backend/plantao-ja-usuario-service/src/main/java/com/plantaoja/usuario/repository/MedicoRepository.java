package com.plantaoja.usuario.repository;

import com.plantaoja.usuario.model.MedicoProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedicoRepository extends JpaRepository<MedicoProfile, Long> {
    Optional<MedicoProfile> findByUserId(Long userId);
    boolean existsByCrm(String crm);
}