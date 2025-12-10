package org.example.notification.repository;

import org.example.notification.entity.Notification;
import org.example.notification.entity.NotificationStatus;
import org.example.notification.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    List<Notification> findByUserIdAndIsWebNotificationTrue(Long userId);
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
    List<Notification> findByStatus(NotificationStatus status);
}