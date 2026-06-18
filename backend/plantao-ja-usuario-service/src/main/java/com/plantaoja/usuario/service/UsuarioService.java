package com.plantaoja.usuario.service;

import com.plantaoja.usuario.dto.UsuarioCreate;
import com.plantaoja.usuario.model.Usuario;
import com.plantaoja.usuario.repository.UsuarioRepository;
import com.plantaoja.usuario.util.InfoUsuario;
import com.plantaoja.usuario.util.Role;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public InfoUsuario cadastrarUsuario(UsuarioCreate usuarioCreate) {
        Usuario usuarioCadastrado = usuarioRepository
                .findByEmail(usuarioCreate.getEmail())
                .orElse(null);

        if (usuarioCadastrado == null) {
            Role roleFinal = usuarioCreate.getRole() != null ? usuarioCreate.getRole() : Role.USER;

            // ⚠️ Senha salva em texto puro para manter consistência com o
            // cadastro de médico, que também não criptografa. Em produção,
            // ambos deveriam usar PasswordEncoder.
            Usuario usuario = new Usuario(
                    null,
                    usuarioCreate.getNome(),
                    usuarioCreate.getEmail(),
                    usuarioCreate.getSenha(),
                    roleFinal,
                    true);
            usuarioRepository.save(usuario);
            return new InfoUsuario(true, false, "Usuário cadastrado com sucesso!");
        } else {
            return new InfoUsuario(false, true, "Email já cadastrado!");
        }
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public List<Usuario> recuperarUsuarios() {
        return usuarioRepository.findAll();
    }
}