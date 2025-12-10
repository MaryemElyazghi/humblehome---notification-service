package org.example.userr.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.userr.event.UserRegisteredEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Component
public class NotificationListener {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @EventListener
    public void handleUserRegistered(UserRegisteredEvent event) {
        try {
            var user = event.getUser();

            Map<String, String> data = new HashMap<>();
            data.put("userName", user.getName());
            data.put("email", user.getEmail());

            Map<String, Object> request = new HashMap<>();
            request.put("userId", (long) user.getId());
            request.put("recipientEmail", user.getEmail());
            request.put("recipientName", user.getName());
            request.put("type", "WELCOME_EMAIL");
            request.put("metadata", objectMapper.writeValueAsString(data));
            request.put("isWebNotification", false);

            restTemplate.postForObject(
                    "http://notification-service/api/notifications/send",
                    request,
                    String.class
            );
        } catch (Exception e) {
            System.err.println("Notification failed: " + e.getMessage());
        }
    }
}