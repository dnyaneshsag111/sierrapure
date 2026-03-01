package com.mineralwater.sierrapure.dto;

import com.mineralwater.sierrapure.model.Client;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClientDTO {
    private String id;
    private String name;
    private String segment;
    private String logoUrl;
    private String description;
    private String location;
    private String bottleSizeUsed;
    private String testimonial;
    private boolean isFeatured;
    private int sortOrder;
    private boolean isActive;
    private LocalDateTime createdAt;

    public static ClientDTO from(Client c) {
        return ClientDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .segment(c.getSegment())
                .logoUrl(c.getLogoUrl())
                .description(c.getDescription())
                .location(c.getLocation())
                .bottleSizeUsed(c.getBottleSizeUsed())
                .testimonial(c.getTestimonial())
                .isFeatured(c.isFeatured())
                .sortOrder(c.getSortOrder())
                .isActive(c.isActive())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
