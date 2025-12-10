package org.example.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderConfirmationData {
    private Long orderId;
    private String userName;
    private Double totalAmount;
    private String orderDate;
    private List<OrderItemData> items;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class OrderItemData {
    private String productName;
    private int quantity;
    private Double price;
}
