package org.example.notification.dto;

import lombok.Data;

@Data
public class PaymentSuccessData {
    private String userName;
    private String transactionId;
    private Long orderId;
    private String paymentMethod;
    private String paymentDate;
    private Double amount;
}