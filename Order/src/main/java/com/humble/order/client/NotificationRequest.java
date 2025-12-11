package com.humble.order.client;

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
    private String type; // WELCOME_EMAIL, ORDER_CONFIRMATION, PAYMENT_SUCCESS, LOW_STOCK_ALERT
    private String metadata; // JSON string
    private boolean isWebNotification;
}