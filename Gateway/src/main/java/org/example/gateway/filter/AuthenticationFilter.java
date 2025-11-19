package org.example.gateway.filter;

import org.example.gateway.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            // 🔹 Toujours prendre la requête originale
            ServerHttpRequest request = exchange.getRequest();

            // Vérifie si la route nécessite une authentification
            if (validator.isSecured.test(request)) {
                // Route sécurisée : vérifier le token

                // Vérifie si l'en-tête "Authorization" est présent
                String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header"));
                }

                String token = authHeader.substring(7); // supprime "Bearer "
                try {
                    // Valide le token
                    jwtUtil.validateToken(token);

                    // Ajoute le header "longInUser" à la requête
                    request = request.mutate()
                            .header("longInUser", jwtUtil.extractUsername(token))
                            .build();

                } catch (Exception e) {
                    return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token"));
                }
            }
            // Si la route n'est pas sécurisée, on laisse passer sans vérification

            // Continue la chaîne de filtres avec la requête (mutée ou originale)
            return chain.filter(exchange.mutate().request(request).build());
        };
    }

    public static class Config {
        // config vide
    }
}
