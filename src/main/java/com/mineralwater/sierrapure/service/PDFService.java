package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.model.LabReport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.util.Locale;

/**
 * PDF generation using Thymeleaf (HTML template) + Flying Saucer (HTML → PDF).
 * Template: src/main/resources/templates/lab-report-pdf.html
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PDFService {

    private final TemplateEngine templateEngine;

    public byte[] generateLabReportPDF(LabReport report) {
        log.info("Generating PDF for batch: {}", report.getBatchNumber());

        // 1. Build Thymeleaf context
        Context ctx = new Context(Locale.ENGLISH);
        ctx.setVariable("report", report);

        // 2. Render HTML string from template
        String html = templateEngine.process("lab-report-pdf", ctx);

        // 3. Convert HTML → PDF via Flying Saucer
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating PDF for batch {}: {}", report.getBatchNumber(), e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage(), e);
        }
    }
}
