package com.mineralwater.sierrapure.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "lab_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabReport {

    @Id
    private String id;

    @Indexed(unique = true)
    private String reportId;           // SP-2026-02-28-001

    @Indexed(unique = true)
    private String batchNumber;        // BATCH-20260228-A1 (printed on bottle + QR)

    @Indexed
    private LocalDate manufacturingDate;

    private LocalDate reportDate;

    private String labName;

    private String labCertification;   // NABL Certified, etc.

    private String testedBy;

    private List<TestParameter> parameters;

    private String overallResult;      // PASS or FAIL

    private String pdfUrl;             // Cloudinary URL for the PDF

    private String qrCodeUrl;          // Cloudinary URL for QR image

    private String qrCodeData;         // The URL encoded in QR

    private String bottleSize;         // 200ml, 500ml, 1000ml, all

    private String remarks;

    @Indexed
    private boolean isPublished;

    @CreatedDate
    private LocalDateTime createdAt;
}
