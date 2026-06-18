package com.plantaoja.usuario.controller;

import com.plantaoja.usuario.model.Usuario;
import com.plantaoja.usuario.repository.UsuarioRepository;
import com.plantaoja.usuario.service.JwtService;
import com.plantaoja.usuario.util.TokenResponse;
import com.plantaoja.usuario.util.UsuarioLogin;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("autenticacao")
public class AuthenticationController {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

// 2. Mude o método de login para este formato simplificado:
    @PostMapping("login")
    public ResponseEntity<?> login(@Valid @RequestBody UsuarioLogin usuarioLogin, HttpServletResponse response) {
        
        // Busca o usuário direto no banco
        Usuario usuario = usuarioRepository.findByEmail(usuarioLogin.getEmail())
                .orElse(null);

        // Se não achar o usuário ou a senha criptografada não bater, barra na hora
        if (usuario == null || !usuarioLogin.getSenha().equals(usuario.getSenha())) { // 👈 Comparação direta
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("E-mail ou senha inválidos.");
        }

        // Se a senha estiver certa, gera o Token igual antes
        String accessToken = jwtService.generateAccessToken(usuario);

        return new ResponseEntity<>(
            new TokenResponse(accessToken, usuario.getId(), usuario.getNome(), usuario.getRole().name()),
            HttpStatus.OK
        );
    }
}