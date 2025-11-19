package com.humble.order.dto;

import lombok.Data;

@Data
public class TotalAmountDTO {
    private Float totalAmount;

    public TotalAmountDTO() {
    }

    public TotalAmountDTO(Float totalAmount) {
        this.totalAmount = totalAmount;
    }
}

