package com.plantaoja.usuario.model;

import com.plantaoja.usuario.util.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Entity
@Table(name="tb_usuario")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    private boolean ativo = true;
}
