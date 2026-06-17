package com.example.plantao_ja_plantao_service.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.plantao_ja_plantao_service.model.Plantao;

@Repository
public interface PlantaoRepository extends JpaRepository<Plantao, Long> {
    // Busca todos os plantões de um hospital específico
    List<Plantao> findByHospitalId(UUID hospitalId);
}