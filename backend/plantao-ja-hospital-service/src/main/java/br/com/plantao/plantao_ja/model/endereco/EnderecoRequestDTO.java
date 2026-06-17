package br.com.plantao.plantao_ja.model.endereco;

public record EnderecoRequestDTO(String cep, String rua,String numero,String complemento) {

    public Hospital toEntity() {
        return new Hospital(null, this.cep, this.rua, this.numero, this.complemento);
    }

}
