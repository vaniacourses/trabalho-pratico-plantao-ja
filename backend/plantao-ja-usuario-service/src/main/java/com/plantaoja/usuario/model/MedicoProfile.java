package com.plantaoja.usuario.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Entity
@Table(name = "tb_medico_profile")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MedicoProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private Usuario user;

    @NonNull
    @Column(unique = true, nullable = false)
    private String crm;

    private String especialidade;
}