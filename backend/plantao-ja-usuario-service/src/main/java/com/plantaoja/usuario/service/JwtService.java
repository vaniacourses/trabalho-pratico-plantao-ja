package com.plantaoja.usuario.service;

import com.plantaoja.usuario.model.Usuario;
import com.plantaoja.usuario.util.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    @Value("chaveteste")
    private String secret;

    @Value("2 horas")
    private String accessTokenExpiration;

    public String generateAccessToken(Usuario usuario) {
        final long tokenExpiration = Long.parseLong(accessTokenExpiration); // 2 horas
        return generateToken(usuario, tokenExpiration);
    }

    private String generateToken(Usuario usuario, long tokenExpiration) {
        return Jwts.builder()
            // subject => algo que identifica unicamente um usuário
            .subject(usuario.getId().toString())
            .claim("name", usuario.getNome())  
            .claim("role", usuario.getRole())   
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + tokenExpiration * 1000))
           
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            boolean valido = claims.getExpiration().after(new Date());
            return valido;
        }
        catch(JwtException e) {
            return false;
        }
    }

    public Claims getClaims(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
            .build()
            .parseSignedClaims(token)
            .getPayload();
        return claims;
    }

    public Long getUserIdFromToken(String token) {
        return Long.valueOf(getClaims(token).getSubject());
    }

    public Role getRoleFromToken(String token) {
        return Role.valueOf(getClaims(token).get("role", String.class));
    }
}