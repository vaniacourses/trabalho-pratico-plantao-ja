package com.plantaoja.usuario.model;

import jakarta.persistence.*;
import lombok.NonNull;

@Entity
@Table(name="tb_usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String nome;

    @NonNull
    private String email;

    @NonNull
    private String senha;

    private boolean ativo = true;


}
