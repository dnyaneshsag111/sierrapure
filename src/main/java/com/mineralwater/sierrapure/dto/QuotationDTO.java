package com.mineralwater.sierrapure.dto;

import com.mineralwater.sierrapure.model.Quotation.QuotationItem;
import lombok.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationDTO {

    private String id;
    private String quotationNumber;
    private String enquiryId;

    // client
    @NotBlank(message = "Client name is required")
    private String clientName;

    @Email(message = "Valid email required")
    private String clientEmail;
    private String clientPhone;
    private String clientCompany;
    private String clientSegment;
    private String clientAddress;

    // items
    @NotEmpty(message = "At least one item is required")
    private List<QuotationItem> items;

    // pricing
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal discountAmount;
    private BigDecimal gstPercent;
    private BigDecimal gstAmount;
    private BigDecimal totalAmount;

    // terms
    private String termsAndConditions;
    private String notes;

    // validity
    private Integer validDays;
    private String validUntil;   // ISO date string from frontend

    // status
    private String status;       // draft | sent | accepted | rejected | expired

    // audit (read-only from backend)
    private String createdBy;
    private String createdAt;
    private String updatedAt;
}
