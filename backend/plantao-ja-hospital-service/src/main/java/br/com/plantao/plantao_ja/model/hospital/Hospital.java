package br.com.plantao.plantao_ja.model.hospital;

import br.com.plantao.plantao_ja.model.endereco.Endereco;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.br.CNPJ;

import java.util.UUID;


@Entity
@Table(name="tb_hospital")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Hospital {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID id;

    private String nome;

    @CNPJ(message="cnpj inválido")
    private String cnpj;

    private float notaMedia = 0;

    private String statusCadastro;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @Column(unique = true)
    private Long gestorId;
}
