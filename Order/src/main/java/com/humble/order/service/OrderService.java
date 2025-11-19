package com.humble.order.service;

import com.humble.order.dto.OrderDTO;
import com.humble.order.dto.OrderItemDTO;
import com.humble.order.dto.ProductDTO;
import com.humble.order.entity.Order;
import com.humble.order.entity.OrderItem;
import com.humble.order.feign.ProductClient;
import com.humble.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private ProductClient productClient;

    public OrderDTO createOrder(List<OrderItemDTO> items, Long userId) {

        Order order = new Order();
        order.setOrderDate(new Date());
        order.setOrderStatus("PENDING");
        order.setUserId(userId);

        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemDTO dto : items) {

            // Call Product service
            ProductDTO product = productClient.getProduct(dto.getProductId());

            OrderItem item = new OrderItem();
            item.setQuantity(dto.getQuantity());
            item.setPrice(product.getPrice());
            item.setProductId(dto.getProductId());
            item.setOrder(order);

            orderItems.add(item);
        }

        order.setItems(orderItems);
        order.calculateTotalAmount();

        Order saved = orderRepo.save(order);

        return toDTO(saved);
    }


    public OrderDTO getOrder(Long id) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return toDTO(order);
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepo.findByUserId(userId);
        return orders.stream()
                .map(this::toDTO)
                .toList();
    }


    private OrderDTO toDTO(Order order) {

        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setUserId(order.getUserId());

        dto.setItems(
                order.getItems().stream().map(i -> {
                    OrderItemDTO d = new OrderItemDTO();
                    d.setId(i.getId());
                    d.setQuantity(i.getQuantity());
                    d.setPrice(i.getPrice());
                    d.setProductId(i.getProductId());
                    return d;
                }).toList()
        );

        return dto;
    }
}

