package com.plantaoja.usuario.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@AllArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
    
    String path = request.getRequestURI();
    
    // 💡 O PULO DO GATO: Se a requisição for o login, ignora o filtro completamente!
    if (path.contains("/autenticacao/login") || path.contains("/medicos")) {
        filterChain.doFilter(request, response);
        return;
    }

    // ... resto do seu código atual do filtro (onde ele busca o Bearer Token)
    filterChain.doFilter(request, response);
}
}