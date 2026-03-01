package com.mineralwater.sierrapure.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    private String id;

    private String name;                   // e.g., "Taj Hotels & Resorts"

    @Indexed
    private String segment;                // hotel, restaurant, industry, travel, events

    private String logoUrl;                // Local URL e.g. /api/v1/images/clients/taj-logo.png

    private String logoFileName;           // Original stored filename

    private String description;            // Short description of the client

    private String location;               // City / State

    private String bottleSizeUsed;         // 200ml, 500ml, 1000ml

    private List<String> bottleImages;     // Bottle images with their branding

    private String testimonial;            // Optional quote from client

    private boolean isFeatured;            // Show on home page

    private int sortOrder;

    @Indexed
    private boolean isActive;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
