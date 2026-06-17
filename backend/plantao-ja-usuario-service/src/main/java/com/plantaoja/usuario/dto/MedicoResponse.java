package com.plantaoja.usuario.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class MedicoResponse {
    private Long id;
    private Long userId;
    private String nomeUsuario;
    private String emailUsuario;
    private String crm;
    private String especialidade;
}