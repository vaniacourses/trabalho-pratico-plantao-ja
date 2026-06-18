package com.example.plantao_ja_plantao_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Especialidade especialidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlantaoStatus status;

    @Column(name = "hospital_id", nullable = false)
    private UUID hospitalId;

    @ElementCollection
    @CollectionTable(name = "plantao_medicos_inscritos", joinColumns = @JoinColumn(name = "plantao_id"))
    @Column(name="medico_inscrito_id")
    private List<Long> medicoInscritosIds = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "plantao_medicos_aceitos", joinColumns = @JoinColumn(name="plantao_id"))
    @Column(name="medico_id")
    private List<Long> medicoAceitosIds = new ArrayList<>();

    // Se o Lombok der problema no seu ambiente de build, adicione manualmente:
    public List<Long> getMedicoInscritosIds() {
        return this.medicoInscritosIds;
    }

    public List<Long> getMedicoAceitosIds() {
        return this.medicoAceitosIds;
    }
}