package com.humble.order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private Date orderDate;

    private Float totalAmount;

    private String orderStatus;

    // Au lieu de stocker l'entité User
    private Long userId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    public void calculateTotalAmount() {
        this.totalAmount = (float) items.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
    }
}

