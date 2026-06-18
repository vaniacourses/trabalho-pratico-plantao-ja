package com.plantao_ja.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
// 🚨 MUITO IMPORTANTE: Todos os imports de CORS abaixo DEVEM ser do pacote .reactive
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;

@Configuration
public class GatewayConfig {

    @Bean
    public CorsWebFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173"); // Permite seu Frontend React
        config.addAllowedMethod("*");                    // Permite POST, GET, PUT, DELETE, etc.
        config.addAllowedHeader("*");                    // Permite qualquer Header (Content-Type, Authorization...)
        config.setAllowCredentials(true);                // Permite cookies/autenticação se precisar

        // Usando a versão reativa correta, o construtor do CorsWebFilter aceita o source direto
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsWebFilter(source); // Limpo, sem precisar de cast forçado!
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Aponta para o contêiner "usuario-service" na porta interna: 8082
                .route("usuarios-service", r -> r
                        .path("/usuarios/**", "/medicos/**", "/autenticacao/**")
                        // 💡 CORRIGIDO: Remove a duplicidade do cabeçalho de CORS mantendo apenas a primeira regra
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")) 
                        .uri("http://usuario-service:8082"))
                
                // Aponta para o contêiner "plantao-service" na porta interna: 8083
                .route("plantao-service", r -> r
                        .path("/plantoes/**")
                        // 💡 CORRIGIDO: Já deixa blindado para as rotas de inscrição do médico
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST"))
                        .uri("http://plantao-service:8083"))
                
                // Aponta para o contêiner "hospital-service" na porta interna: 8081
                .route("hospital-service", r -> r
                        .path("/hospital/**", "/endereco/**")
                        .uri("http://hospital-service:8081"))
                .build();
    }
}