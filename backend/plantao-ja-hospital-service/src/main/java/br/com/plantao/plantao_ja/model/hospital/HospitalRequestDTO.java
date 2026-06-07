package br.com.plantao.plantao_ja.model.hospital;

import br.com.plantao.plantao_ja.model.endereco.Endereco;


public record HospitalRequestDTO(String nome, String cnpj, float notaMedia, String statusCadastro, Endereco endereco) {

    public Hospital toEntity() {
        return new Hospital(null, this.nome, this.cnpj, this.notaMedia, this.statusCadastro, this.endereco);
    }

}
