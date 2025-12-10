package org.example.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.notification.dto.*;
import org.example.notification.entity.Notification;
import org.example.notification.entity.NotificationStatus;
import org.example.notification.entity.NotificationType;
import org.example.notification.repository.NotificationRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final NotificationRepository notificationRepository;
    private final TemplateEngine templateEngine;
    private final ObjectMapper objectMapper;

    //  PAYMENT SUCCESS - NOUVEAU
    public void sendPaymentSuccess(NotificationRequest request) {
        try {
            PaymentSuccessData data = objectMapper.readValue(
                    request.getMetadata(), PaymentSuccessData.class);

            Context context = new Context();
            context.setVariable("userName", data.getUserName());
            context.setVariable("transactionId", data.getTransactionId());
            context.setVariable("orderId", data.getOrderId());
            context.setVariable("paymentMethod", data.getPaymentMethod());
            context.setVariable("paymentDate", data.getPaymentDate());
            context.setVariable("amount", data.getAmount());

            String htmlContent = templateEngine.process("payment-success", context);

            Notification notification = createNotification(
                    request,
                    "Payment Successful - Order #" + data.getOrderId(),
                    htmlContent,
                    NotificationType.PAYMENT_SUCCESS
            );

            sendEmail(request.getRecipientEmail(),
                    "Payment Successful - $" + data.getAmount(),
                    htmlContent);

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);

            // Web notification
            createWebNotification(
                    request.getUserId(),
                    "Payment Successful",
                    "Your payment of $" + data.getAmount() + " was processed!",
                    NotificationType.PAYMENT_SUCCESS,
                    request.getMetadata()
            );

            log.info("Payment success sent for order: {}", data.getOrderId());

        } catch (Exception e) {
            log.error("Failed to send payment success", e);
            saveFailedNotification(request, e.getMessage());
        }
    }

    // ========================================
    // WELCOME EMAIL - After Signup
    // ========================================
    public void sendWelcomeEmail(NotificationRequest request) {
        try {
            WelcomeEmailData data = objectMapper.readValue(
                    request.getMetadata(), WelcomeEmailData.class);

            Context context = new Context();
            context.setVariable("userName", data.getUserName());
            context.setVariable("email", data.getEmail());

            String htmlContent = templateEngine.process("welcome-email", context);

            Notification notification = createNotification(
                    request,
                    "Welcome to HumbleHome! 🎉",
                    htmlContent,
                    NotificationType.WELCOME_EMAIL
            );

            sendEmail(request.getRecipientEmail(),
                    "Welcome to HumbleHome! 🎉",
                    htmlContent);

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);

            log.info("Welcome email sent to: {}", request.getRecipientEmail());

        } catch (Exception e) {
            log.error("Failed to send welcome email", e);
            saveFailedNotification(request, e.getMessage());
        }
    }

    // ========================================
    // ORDER CONFIRMATION - After Successful Order
    // ========================================
    public void sendOrderConfirmation(NotificationRequest request) {
        try {
            OrderConfirmationData data = objectMapper.readValue(
                    request.getMetadata(), OrderConfirmationData.class);

            Context context = new Context();
            context.setVariable("orderId", data.getOrderId());
            context.setVariable("userName", data.getUserName());
            context.setVariable("totalAmount", data.getTotalAmount());
            context.setVariable("orderDate", data.getOrderDate());
            context.setVariable("items", data.getItems());

            String htmlContent = templateEngine.process("order-confirmation", context);

            Notification notification = createNotification(
                    request,
                    "Order Confirmation - #" + data.getOrderId(),
                    htmlContent,
                    NotificationType.ORDER_CONFIRMATION
            );

            sendEmail(request.getRecipientEmail(),
                    "Order Confirmation - #" + data.getOrderId(),
                    htmlContent);

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);

            // Also create WEB notification for user profile
            createWebNotification(
                    request.getUserId(),
                    "Order #" + data.getOrderId() + " Confirmed",
                    "Your order has been successfully placed!",
                    NotificationType.ORDER_CONFIRMATION,
                    request.getMetadata()
            );

            log.info("Order confirmation sent for order: {}", data.getOrderId());

        } catch (Exception e) {
            log.error("Failed to send order confirmation", e);
            saveFailedNotification(request, e.getMessage());
        }
    }

    // ========================================
    // LOW STOCK ALERT - Product in Cart
    // ========================================
    public void sendLowStockAlert(NotificationRequest request) {
        try {
            LowStockAlertData data = objectMapper.readValue(
                    request.getMetadata(), LowStockAlertData.class);

            // Create WEB notification (no email for this one)
            Notification notification = new Notification();
            notification.setUserId(request.getUserId());
            notification.setRecipientEmail(request.getRecipientEmail());
            notification.setSubject("Low Stock Alert");
            notification.setMessage(
                    String.format("⚠️ %s has only %d items left in stock!",
                            data.getProductName(), data.getCurrentStock())
            );
            notification.setType(NotificationType.LOW_STOCK_ALERT);
            notification.setStatus(NotificationStatus.SENT);
            notification.setMetadata(request.getMetadata());
            notification.setIsWebNotification(true);
            notification.setIsRead(false);
            notification.setSentAt(LocalDateTime.now());

            notificationRepository.save(notification);

            log.info("Low stock alert created for user: {}, product: {}",
                    request.getUserId(), data.getProductName());

        } catch (Exception e) {
            log.error("Failed to create low stock alert", e);
        }
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    private void sendEmail(String to, String subject, String body)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);
        helper.setFrom("noreply@humblehome.com");
        mailSender.send(message);
    }

    private Notification createNotification(NotificationRequest request,
                                            String subject,
                                            String message,
                                            NotificationType type) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setRecipientEmail(request.getRecipientEmail());
        notification.setSubject(subject);
        notification.setMessage(message);
        notification.setType(type);
        notification.setStatus(NotificationStatus.PENDING);
        notification.setMetadata(request.getMetadata());
        return notificationRepository.save(notification);
    }

    private void createWebNotification(Long userId, String subject,
                                       String message, NotificationType type,
                                       String metadata) {
        Notification webNotif = new Notification();
        webNotif.setUserId(userId);
        webNotif.setRecipientEmail("");
        webNotif.setSubject(subject);
        webNotif.setMessage(message);
        webNotif.setType(type);
        webNotif.setStatus(NotificationStatus.SENT);
        webNotif.setMetadata(metadata);
        webNotif.setWebNotification(true);
        webNotif.setRead(false);
        webNotif.setSentAt(LocalDateTime.now());
        notificationRepository.save(webNotif);
    }

    private void saveFailedNotification(NotificationRequest request, String error) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setRecipientEmail(request.getRecipientEmail());
        notification.setType(request.getType());
        notification.setStatus(NotificationStatus.FAILED);
        notification.setErrorMessage(error);
        notification.setMetadata(request.getMetadata());
        notificationRepository.save(notification);
    }
}