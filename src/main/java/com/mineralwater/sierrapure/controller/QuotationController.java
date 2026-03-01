package com.mineralwater.sierrapure.controller;

import com.mineralwater.sierrapure.dto.ApiResponse;
import com.mineralwater.sierrapure.dto.QuotationDTO;
import com.mineralwater.sierrapure.model.Quotation;
import com.mineralwater.sierrapure.service.QuotationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/quotations")
@RequiredArgsConstructor
@Tag(name = "Quotations", description = "Create and manage customer quotations")
public class QuotationController {

    private final QuotationService quotationService;

    /** List all quotations (admin only) */
    @GetMapping
    @Operation(summary = "List all quotations")
    public ResponseEntity<ApiResponse<List<Quotation>>> getAll(
            @RequestParam(required = false) String status) {
        List<Quotation> list = (status != null && !status.isBlank())
                ? quotationService.getByStatus(status)
                : quotationService.getAll();
        return ResponseEntity.ok(ApiResponse.success(list, "Quotations fetched"));
    }

    /** Get single quotation */
    @GetMapping("/{id}")
    @Operation(summary = "Get quotation by id")
    public ResponseEntity<ApiResponse<Quotation>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(quotationService.getById(id), "Quotation fetched"));
    }

    /** Create new quotation */
    @PostMapping
    @Operation(summary = "Create quotation")
    public ResponseEntity<ApiResponse<Quotation>> create(
            @Valid @RequestBody QuotationDTO dto,
            Authentication auth) {
        String createdBy = auth != null ? auth.getName() : "admin";
        Quotation saved = quotationService.create(dto, createdBy);
        return ResponseEntity.ok(ApiResponse.success(saved, "Quotation created: " + saved.getQuotationNumber()));
    }

    /** Update existing quotation */
    @PutMapping("/{id}")
    @Operation(summary = "Update quotation")
    public ResponseEntity<ApiResponse<Quotation>> update(
            @PathVariable String id,
            @Valid @RequestBody QuotationDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(quotationService.update(id, dto), "Quotation updated"));
    }

    /** Send quotation email to client */
    @PostMapping("/{id}/send")
    @Operation(summary = "Send quotation to client via email")
    public ResponseEntity<ApiResponse<Quotation>> send(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(quotationService.send(id), "Quotation sent to client"));
    }

    /** Update status only */
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update quotation status")
    public ResponseEntity<ApiResponse<Quotation>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "draft");
        return ResponseEntity.ok(ApiResponse.success(quotationService.updateStatus(id, status), "Status updated"));
    }

    /** Delete quotation */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete quotation")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        quotationService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Quotation deleted"));
    }
}
