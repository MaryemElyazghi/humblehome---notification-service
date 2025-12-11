package org.example.notification.service;

import org.example.notification.dto.NotificationRequest;
import org.example.notification.entity.Notification;
import org.example.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public void processNotification(NotificationRequest request) {
        switch (request.getType()) {
            case WELCOME_EMAIL:
                emailService.sendWelcomeEmail(request);
                break;
            case ORDER_CONFIRMATION:
                emailService.sendOrderConfirmation(request);
                break;
            case PAYMENT_SUCCESS:
                emailService.sendPaymentSuccess(request);
                break;
            case LOW_STOCK_ALERT:
                emailService.sendLowStockAlert(request);
                break;
        }
    }

    // ✅ FIXED: Added missing method
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    // ✅ FIXED: Added missing method
    public List<Notification> getUserWebNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsWebNotificationTrue(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notif -> {
            notif.setRead(true);
            notificationRepository.save(notif);
        });
    }
}