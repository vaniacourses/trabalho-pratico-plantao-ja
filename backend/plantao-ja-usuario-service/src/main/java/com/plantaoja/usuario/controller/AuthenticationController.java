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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("autenticacao")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody UsuarioLogin usuarioLogin,
                                               HttpServletResponse response) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(usuarioLogin.getEmail(), usuarioLogin.getSenha()));
        Usuario usuario = usuarioRepository.findByEmail(usuarioLogin.getEmail()).orElseThrow();
        String accessToken = jwtService.generateAccessToken(usuario);

        return new ResponseEntity<>(
            new TokenResponse(accessToken, usuario.getId(), usuario.getNome(), usuario.getRole().name()),
            HttpStatus.OK
        );
    }
}