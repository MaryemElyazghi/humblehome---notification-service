package org.example.gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {


    public static final List<String> openApiEndpoints = List.of(
            "/authh/controller/register",
            "/authh/controller/token",
            "/authh/controller/validate",
            "/authh/controller/addNewUser",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> {
                String path = request.getURI().getPath();
                return openApiEndpoints
                        .stream()
                        .noneMatch(endpoint -> path.equals(endpoint) || path.startsWith(endpoint + "/"));
            };




}
