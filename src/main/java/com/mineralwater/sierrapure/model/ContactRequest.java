package com.mineralwater.sierrapure.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactRequest {

    @Id
    private String id;

    private String name;

    @Indexed
    private String email;

    private String phone;

    private String company;

    @Indexed
    private String segment;        // hotel, restaurant, industry, travel, events, other

    private List<String> bottleSizes; // [200ml, 500ml, 1000ml]

    private String message;

    private boolean customLabel;

    private boolean isSampleRequest;   // true when submitted via "Request Sample" flow

    private String deliveryAddress;    // used for sample delivery

    @Indexed
    private String status;         // new, contacted, closed

    @CreatedDate
    private LocalDateTime createdAt;
}
