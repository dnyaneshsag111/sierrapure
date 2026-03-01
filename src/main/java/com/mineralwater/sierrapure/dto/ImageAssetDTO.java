package com.mineralwater.sierrapure.dto;

import com.mineralwater.sierrapure.model.ImageAsset;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ImageAssetDTO {
    private String id;
    private String category;
    private String label;
    private String originalName;
    private String publicUrl;
    private String contentType;
    private long sizeBytes;
    private LocalDateTime uploadedAt;

    public static ImageAssetDTO from(ImageAsset a) {
        return ImageAssetDTO.builder()
                .id(a.getId())
                .category(a.getCategory())
                .label(a.getLabel())
                .originalName(a.getOriginalName())
                .publicUrl(a.getPublicUrl())
                .contentType(a.getContentType())
                .sizeBytes(a.getSizeBytes())
                .uploadedAt(a.getUploadedAt())
                .build();
    }
}
