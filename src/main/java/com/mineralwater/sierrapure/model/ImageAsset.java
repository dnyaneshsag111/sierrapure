package com.mineralwater.sierrapure.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "image_assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageAsset {

    @Id
    private String id;

    @Indexed
    private String category;       // BOTTLE, CLIENT_LOGO, SIERRA_LOGO

    private String label;          // e.g., "200ml", "500ml", "Taj Hotels", "Sierra Pure Logo"

    private String originalName;   // original uploaded file name

    private String storedName;     // UUID-based stored name

    private String filePath;       // absolute path on disk

    private String publicUrl;      // accessible URL: /api/v1/images/{category}/{storedName}

    private String contentType;    // image/png, image/jpeg, image/svg+xml

    private long sizeBytes;

    private String uploadedBy;     // future: admin user

    @CreatedDate
    private LocalDateTime uploadedAt;
}
