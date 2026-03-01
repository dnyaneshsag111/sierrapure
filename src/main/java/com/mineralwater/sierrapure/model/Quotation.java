package com.mineralwater.sierrapure.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "quotations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quotation {

    @Id
    private String id;

    @Indexed(unique = true)
    private String quotationNumber;   // e.g. QT-20260301-0001

    // ── Linked enquiry (optional) ──────────────────────────────────
    private String enquiryId;

    // ── Client details ─────────────────────────────────────────────
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private String clientCompany;
    private String clientSegment;
    private String clientAddress;

    // ── Line items ─────────────────────────────────────────────────
    private List<QuotationItem> items;

    // ── Pricing ────────────────────────────────────────────────────
    private BigDecimal subtotal;
    private BigDecimal discount;          // percentage
    private BigDecimal discountAmount;
    private BigDecimal gstPercent;
    private BigDecimal gstAmount;
    private BigDecimal totalAmount;

    // ── Terms ──────────────────────────────────────────────────────
    private String termsAndConditions;
    private String notes;

    // ── Validity ───────────────────────────────────────────────────
    private Integer validDays;
    private LocalDate validUntil;

    // ── Status: draft | sent | accepted | rejected | expired ───────
    @Indexed
    private String status;

    // ── Audit ──────────────────────────────────────────────────────
    private String createdBy;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ── Nested item ────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuotationItem {
        private String description;
        private String size;          // 200ml | 500ml | 1000ml
        private Integer quantity;
        private BigDecimal unitPrice;
        private Boolean customLabel;
        private String note;
    }
}
