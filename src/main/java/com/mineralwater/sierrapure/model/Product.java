package com.mineralwater.sierrapure.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String id;

    private String name;

    @Indexed
    private String size; // 200ml, 500ml, 1000ml

    @Indexed
    private String category; // standard, premium, custom

    private String description;

    private List<String> features;

    private String imageUrl;

    private String thumbnailUrl;

    private boolean isCustomizable;

    @Indexed
    private List<String> targetSegments; // hotel, restaurant, industry, travel, events

    private String priceRange;

    private String packagingInfo;

    private int sortOrder;

    @Indexed
    private boolean isActive;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
