package com.plantaoja.usuario.dto;

import com.plantaoja.usuario.util.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UsuarioCreate {
    @NotEmpty(message = "O 'Nome' deve ser informado.")
    private String nome;

    @NotEmpty(message = "O 'Email' deve ser informado.")
    @Email(message = "Email inválido.")
    private String email;

    @NotEmpty(message = "A 'Senha' deve ser informada.")
    private String senha;

    @NotNull(message = "A 'Role' deve ser informada.")
    private Role role; 
}