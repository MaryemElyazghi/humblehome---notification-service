package org.example.payement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PaymentNotificationService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void notifyPaymentSuccess(PaymentDetails payment) {
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("userName", payment.getUserName());
            data.put("transactionId", payment.getTransactionId());
            data.put("orderId", payment.getOrderId());
            data.put("paymentMethod", payment.getMethod());
            data.put("paymentDate", new SimpleDateFormat("MMM dd, yyyy").format(new Date()));
            data.put("amount", payment.getAmount());

            Map<String, Object> request = new HashMap<>();
            request.put("userId", payment.getUserId());
            request.put("recipientEmail", payment.getUserEmail());
            request.put("recipientName", payment.getUserName());
            request.put("type", "PAYMENT_SUCCESS");
            request.put("metadata", objectMapper.writeValueAsString(data));
            request.put("isWebNotification", true);

            restTemplate.postForObject(
                    "http://notification-service/api/notifications/send",
                    request,
                    String.class
            );
        } catch (Exception e) {
            System.err.println("Payment notification failed: " + e.getMessage());
        }
    }
}

// ✅ FIXED: Complete DTO with proper Lombok annotations
@Data
class PaymentDetails {
    private Long userId;
    private String userName;
    private String userEmail;
    private String transactionId;
    private Long orderId;
    private String method;
    private Double amount;
}