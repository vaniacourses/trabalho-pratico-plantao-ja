package com.example.plantao_ja_plantao_service.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PlantaoRequestDTO(
    UUID hospitalId, 
    LocalDateTime dataInicio, 
    LocalDateTime dataFim, 
    BigDecimal remuneracao
) {}