package com.plantaoja.usuario.service;

import com.plantaoja.usuario.model.Usuario;
import com.plantaoja.usuario.util.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    // Chave gerada automaticamente, sempre com tamanho seguro (256 bits) para HS256.
    // Reinicia a cada restart do serviço — tokens antigos expiram, mas isso é
    // inofensivo em desenvolvimento. Para produção, mover para uma variável de
    // ambiente persistente.
    private final SecretKey secret = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 2 horas em milissegundos
    private final long accessTokenExpiration = 2 * 60 * 60 * 1000;

    public String generateAccessToken(Usuario usuario) {
        return generateToken(usuario, accessTokenExpiration);
    }

    private String generateToken(Usuario usuario, long tokenExpirationMillis) {
        return Jwts.builder()
                .subject(usuario.getId().toString())
                .claim("name", usuario.getNome())
                .claim("role", usuario.getRole())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + tokenExpirationMillis))
                .signWith(secret)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (JwtException e) {
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secret)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getUserIdFromToken(String token) {
        return Long.valueOf(getClaims(token).getSubject());
    }

    public Role getRoleFromToken(String token) {
        return Role.valueOf(getClaims(token).get("role", String.class));
    }
}