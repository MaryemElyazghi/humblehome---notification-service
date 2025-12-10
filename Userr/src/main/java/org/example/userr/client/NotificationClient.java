package org.example.userr.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications/send")
    String sendNotification(@RequestBody NotificationRequest request);
}

// DTO Class
class NotificationRequest {
    private Long userId;
    private String recipientEmail;
    private String recipientName;
    private String type; // "WELCOME_EMAIL"
    private String metadata;
    private boolean isWebNotification;

    // Getters and Setters
}