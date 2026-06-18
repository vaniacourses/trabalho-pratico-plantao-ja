package com.plantaoja.usuario.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MedicoCreate {
    private String nome;         // 💡 Adicionado
    private String email;        // 💡 Adicionado
    private String senha;        // 💡 Adicionado
    private String crm;
    private String especialidade; // (ou especialidade)
}