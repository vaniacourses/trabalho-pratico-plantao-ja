package com.plantaoja.usuario.filter;

import com.plantaoja.usuario.service.JwtService;
import com.plantaoja.usuario.util.Role;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
        throws ServletException, IOException {

        var authHeader = request.getHeader("Authorization");


        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }


        var token = authHeader.replace("Bearer ", "");   
        if (!jwtService.validateToken(token)) {

            filterChain.doFilter(request, response);
            return;
        }


        long id_usuario = jwtService.getUserIdFromToken(token);
        Role role = jwtService.getRoleFromToken(token);

        var authenticationToken = new UsernamePasswordAuthenticationToken(
            id_usuario,
            null, 
            List.of(new SimpleGrantedAuthority("ROLE_" + role)));

      

        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));


        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        filterChain.doFilter(request, response);

    }
}