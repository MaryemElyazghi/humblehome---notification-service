package org.example.notification.entity;

public enum NotificationType {
    WELCOME_EMAIL,           // After signup
    ORDER_CONFIRMATION,      // After successful order
    PAYMENT_SUCCESS,         // After successful payment
    LOW_STOCK_ALERT         // Product in cart low stock
}
