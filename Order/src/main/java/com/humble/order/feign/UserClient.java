package com.humble.order.feign;

import com.humble.order.model.Utilisateur;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {

    @GetMapping("/authh/controller/find-by-username/{username}")
    Utilisateur getUserByUsername(@PathVariable String username);
}

