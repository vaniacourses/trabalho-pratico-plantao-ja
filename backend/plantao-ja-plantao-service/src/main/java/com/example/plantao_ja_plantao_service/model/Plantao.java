package com.example.plantao_ja_plantao_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "plantoes")
@Getter             // <-- O Lombok cria todos os get...() automaticamente
@Setter             // <-- O Lombok cria todos os set...() automaticamente
@NoArgsConstructor  // <-- Cria um construtor vazio (Obrigatório para o Spring/JPA)
@AllArgsConstructor // <-- Cria um construtor com todos os atributos
public class Plantao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataInicio;

    @Column(nullable = false)
    private LocalDateTime dataFim;

    @Column(nullable = false)
    private BigDecimal remuneracao;

    @Column(nullable = false)
    private String status;

    @Column(name = "hospital_id", nullable = false)
    private UUID hospitalId;
}