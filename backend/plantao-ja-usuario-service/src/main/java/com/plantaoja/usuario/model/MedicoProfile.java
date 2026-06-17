package com.plantaoja.usuario.model;

import jakarta.persistence.*;
import lombok.NonNull;


@Entity
@Table(name="tb_medico_profile")
public class MedicoProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Usuario user;

    @NonNull
    private String crm;

    private String especialidade;
}