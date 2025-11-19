package com.humble.order.controller;

import com.humble.order.dto.OrderDTO;
import com.humble.order.dto.OrderItemDTO;
import com.humble.order.feign.UserClient;
import com.humble.order.model.Utilisateur;
import com.humble.order.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService service;

    @Autowired
    private UserClient userClient;

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody List<OrderItemDTO> items, HttpServletRequest request) {
        try {
            // 🔵 récupérer username du header envoyé par le Gateway
            String username = request.getHeader("longInUser");

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Missing username in headers");
            }

            // 🔵 appel du microservice utilisateur via Feign
            Utilisateur user = userClient.getUserByUsername(username);

            // Ici tu récupères l'ID du user depuis le MS User :
            Long userId = (long) user.getId();

            OrderDTO order = service.createOrder(items, userId);
            return ResponseEntity.ok(order);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        try {
            OrderDTO order = service.getOrder(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<Object> getMyOrders(HttpServletRequest request) {
        try {
            // 🔵 récupérer username du header envoyé par le Gateway
            String username = request.getHeader("longInUser");

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Missing username in headers");
            }

            // 🔵 appel du microservice utilisateur via Feign
            Utilisateur user = userClient.getUserByUsername(username);

            // Ici tu récupères l'ID du user depuis le MS User :
            Long userId = (long) user.getId();

            List<OrderDTO> orders = service.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Orders not found");
        }
    }
}

