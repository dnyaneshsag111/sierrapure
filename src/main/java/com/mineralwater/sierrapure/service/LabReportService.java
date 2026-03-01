package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.dto.LabReportDTO;
import com.mineralwater.sierrapure.exception.ResourceNotFoundException;
import com.mineralwater.sierrapure.model.LabReport;
import com.mineralwater.sierrapure.repository.LabReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabReportService {

    private final LabReportRepository labReportRepository;
    private final QRCodeService qrCodeService;

    @Value("${app.base.url}")
    private String baseUrl;

    public Page<LabReportDTO> getAllPublishedReports(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return labReportRepository
                .findByIsPublishedTrueOrderByManufacturingDateDesc(pageable)
                .map(this::toDTO);
    }

    public LabReportDTO getReportById(String id) {
        LabReport report = labReportRepository.findById(id)
                .filter(LabReport::isPublished)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Report", "id", id));
        return toDTO(report);
    }

    public LabReportDTO getReportByBatchNumber(String batchNumber) {
        LabReport report = labReportRepository
                .findByBatchNumberAndIsPublishedTrue(batchNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Report", "batchNumber", batchNumber));
        return toDTO(report);
    }

    public LabReportDTO getReportByDate(String dateStr) {
        LocalDate date;
        try {
            date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD");
        }
        LabReport report = labReportRepository
                .findByManufacturingDateAndIsPublishedTrue(date)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Report", "date", dateStr));
        return toDTO(report);
    }

    public LabReportDTO getLatestReport() {
        LabReport report = labReportRepository
                .findTopByIsPublishedTrueOrderByManufacturingDateDesc()
                .orElseThrow(() -> new ResourceNotFoundException("No published lab reports found"));
        return toDTO(report);
    }

    public LabReport createReport(LabReport report) {
        // Generate unique report ID: SP-YYYY-MM-DD-NNN
        String date = report.getManufacturingDate().toString().replace("-", "");
        long count = labReportRepository.count() + 1;
        report.setReportId(String.format("SP-%s-%03d", date, count));
        report.setQrCodeData(qrCodeService.buildQRUrl(report.getBatchNumber()));
        log.info("Creating lab report: {} for batch: {}", report.getReportId(), report.getBatchNumber());
        return labReportRepository.save(report);
    }

    public LabReport updateReport(String id, LabReport updated) {
        LabReport existing = getRawReportById(id);
        updated.setId(existing.getId());
        updated.setReportId(existing.getReportId());
        updated.setCreatedAt(existing.getCreatedAt());
        log.info("Updating lab report: {}", id);
        return labReportRepository.save(updated);
    }

    public LabReport setPublished(String id, boolean publish) {
        LabReport report = getRawReportById(id);
        report.setPublished(publish);
        log.info("Setting lab report {} published={}", id, publish);
        return labReportRepository.save(report);
    }

    public byte[] getReportPDFBytes(String id) {
        // PDF generation delegated to PDFService via controller
        LabReport report = labReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Report", "id", id));
        return null; // Actual bytes returned by PDFService in controller
    }

    public LabReport getRawReportById(String id) {
        return labReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Report", "id", id));
    }

    private LabReportDTO toDTO(LabReport report) {
        return LabReportDTO.builder()
                .id(report.getId())
                .reportId(report.getReportId())
                .batchNumber(report.getBatchNumber())
                .manufacturingDate(report.getManufacturingDate())
                .reportDate(report.getReportDate())
                .labName(report.getLabName())
                .labCertification(report.getLabCertification())
                .testedBy(report.getTestedBy())
                .parameters(report.getParameters())
                .overallResult(report.getOverallResult())
                .pdfUrl(report.getPdfUrl())
                .qrCodeUrl(report.getQrCodeUrl())
                .qrCodeData(report.getQrCodeData())
                .bottleSize(report.getBottleSize())
                .remarks(report.getRemarks())
                .isPublished(report.isPublished())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
