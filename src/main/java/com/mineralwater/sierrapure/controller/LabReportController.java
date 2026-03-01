package com.mineralwater.sierrapure.controller;

import com.mineralwater.sierrapure.dto.ApiResponse;
import com.mineralwater.sierrapure.dto.LabReportDTO;
import com.mineralwater.sierrapure.model.LabReport;
import com.mineralwater.sierrapure.service.LabReportService;
import com.mineralwater.sierrapure.service.PDFService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/lab-reports")
@RequiredArgsConstructor
@Tag(name = "Lab Reports", description = "CRUD, publish toggle, search, PDF download and QR code for lab reports")
public class LabReportController {

    private final LabReportService labReportService;
    private final PDFService pdfService;

    /** Paginated list of all published reports */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<LabReportDTO>>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.success(labReportService.getAllPublishedReports(page, size),
                        "Lab reports fetched successfully"));
    }

    /** Latest report (for Home page widget) */
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<LabReportDTO>> getLatestReport() {
        return ResponseEntity.ok(
                ApiResponse.success(labReportService.getLatestReport(),
                        "Latest lab report fetched successfully"));
    }

    /** Get by MongoDB ID */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LabReportDTO>> getReportById(@PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success(labReportService.getReportById(id),
                        "Lab report fetched successfully"));
    }

    /** Get by batch number — QR code scan lands here */
    @GetMapping("/batch/{batchNumber}")
    public ResponseEntity<ApiResponse<LabReportDTO>> getReportByBatch(
            @PathVariable String batchNumber) {
        return ResponseEntity.ok(
                ApiResponse.success(labReportService.getReportByBatchNumber(batchNumber),
                        "Lab report fetched successfully"));
    }

    /** Get by manufacturing date (YYYY-MM-DD) */
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<LabReportDTO>> getReportByDate(@PathVariable String date) {
        return ResponseEntity.ok(
                ApiResponse.success(labReportService.getReportByDate(date),
                        "Lab report fetched successfully"));
    }

    /** Download PDF for a report */
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPDF(@PathVariable String id) {
        LabReport report = labReportService.getRawReportById(id);
        byte[] pdfBytes = pdfService.generateLabReportPDF(report);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment",
                "SierraPure-LabReport-" + report.getBatchNumber() + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    /** Create a new lab report */
    @PostMapping
    public ResponseEntity<ApiResponse<LabReport>> createReport(@RequestBody LabReport report) {
        return ResponseEntity.ok(
                ApiResponse.success(labReportService.createReport(report),
                        "Lab report created successfully"));
    }

    /** Update an existing lab report */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LabReport>> updateReport(
            @PathVariable String id, @RequestBody LabReport report) {
        return ResponseEntity.ok(
                ApiResponse.success(labReportService.updateReport(id, report),
                        "Lab report updated successfully"));
    }

    /** Toggle publish/unpublish */
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<LabReport>> togglePublish(
            @PathVariable String id, @RequestBody Map<String, Boolean> body) {
        boolean publish = body.getOrDefault("isPublished", true);
        return ResponseEntity.ok(
                ApiResponse.success(labReportService.setPublished(id, publish),
                        publish ? "Report published" : "Report unpublished"));
    }
}
