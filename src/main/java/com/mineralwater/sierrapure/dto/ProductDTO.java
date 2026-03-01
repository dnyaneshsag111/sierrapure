package com.mineralwater.sierrapure.dto;

import com.mineralwater.sierrapure.model.Product;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductDTO {
    private String id;
    private String name;
    private String size;
    private String category;
    private String description;
    private List<String> features;
    private String imageUrl;
    private boolean isCustomizable;
    private List<String> targetSegments;
    private String priceRange;
    private String packagingInfo;
    private int sortOrder;

    public static ProductDTO from(Product p) {
        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .size(p.getSize())
                .category(p.getCategory())
                .description(p.getDescription())
                .features(p.getFeatures())
                .imageUrl(p.getImageUrl())
                .isCustomizable(p.isCustomizable())
                .targetSegments(p.getTargetSegments())
                .priceRange(p.getPriceRange())
                .packagingInfo(p.getPackagingInfo())
                .sortOrder(p.getSortOrder())
                .build();
    }
}
