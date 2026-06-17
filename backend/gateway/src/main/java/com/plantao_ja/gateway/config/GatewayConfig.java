package com.plantao_ja.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()

                .route("usuarios-service", r -> r
                        .path(
                                "/usuarios/**",
                                "/medicos/**",
                                "/autenticacao/**"
                        )
                        .uri("http://localhost:8082"))
                .route("plantao-service", r -> r
                        .path("/plantoes/**")
                        .uri("http://localhost:8888"))
                .route("hospital-service", r -> r
                        .path("/hospital/**")
                        .uri("http://localhost:8081"))
                .build();
    }
}