package org.example.notification.dto;

import org.example.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private Long userId;
    private String recipientEmail;
    private String recipientName;
    private NotificationType type;
    private String metadata; // JSON string
    private boolean isWebNotification;
}