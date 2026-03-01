package com.mineralwater.sierrapure.controller;

import com.mineralwater.sierrapure.dto.ApiResponse;
import com.mineralwater.sierrapure.dto.ContactRequestDTO;
import com.mineralwater.sierrapure.model.ContactRequest;
import com.mineralwater.sierrapure.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
@Tag(name = "Enquiries", description = "Submit and manage business enquiries (contact form)")
public class ContactController {

    private final ContactService contactService;

    /** Submit a new enquiry (public) */
    @Operation(summary = "Submit enquiry", description = "Public endpoint — rate limited to 3 requests per 5 minutes per IP. Triggers auto-reply email to customer and admin notification.")
    @PostMapping
    public ResponseEntity<ApiResponse<ContactRequest>> submitEnquiry(
            @Valid @RequestBody ContactRequestDTO dto) {
        ContactRequest saved = contactService.submitEnquiry(dto);
        return ResponseEntity.ok(
                ApiResponse.success(saved, "Thank you! Your enquiry has been submitted. We will contact you within 24 hours."));
    }

    /** List all enquiries — optionally filter by status (new / contacted / closed) */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactRequest>>> getAllEnquiries(
            @RequestParam(required = false) String status) {
        List<ContactRequest> list = (status != null && !status.isBlank())
                ? contactService.getByStatus(status)
                : contactService.getAll();
        return ResponseEntity.ok(ApiResponse.success(list, "Enquiries fetched successfully"));
    }

    /** Get a single enquiry by id */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactRequest>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(contactService.getById(id), "Enquiry fetched"));
    }

    /** Update enquiry status: new → contacted → closed */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ContactRequest>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.getOrDefault("status", "contacted");
        return ResponseEntity.ok(ApiResponse.success(
                contactService.updateStatus(id, newStatus), "Status updated to: " + newStatus));
    }
}
