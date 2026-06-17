package br.com.plantao.plantao_ja.model.endereco;

public record EnderecoRequestDTO(String cep, String rua, int numero,String complemento) {

    public Endereco toEntity() {
        return new Endereco(null, this.cep, this.rua, this.numero, this.complemento);
    }

}
