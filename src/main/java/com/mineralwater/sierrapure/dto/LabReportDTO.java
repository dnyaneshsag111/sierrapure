package com.mineralwater.sierrapure.dto;

import com.mineralwater.sierrapure.model.TestParameter;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabReportDTO {

    private String id;
    private String reportId;
    private String batchNumber;
    private LocalDate manufacturingDate;
    private LocalDate reportDate;
    private String labName;
    private String labCertification;
    private String testedBy;
    private List<TestParameter> parameters;
    private String overallResult;
    private String pdfUrl;
    private String qrCodeUrl;
    private String qrCodeData;
    private String bottleSize;
    private String remarks;
    private boolean isPublished;
    private LocalDateTime createdAt;
}
