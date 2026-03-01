package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.dto.QuotationDTO;
import com.mineralwater.sierrapure.model.Quotation;
import com.mineralwater.sierrapure.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final EmailService emailService;

    private static final DateTimeFormatter QN_DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMdd");

    // ── CRUD ───────────────────────────────────────────────────────────────

    public List<Quotation> getAll() {
        return quotationRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Quotation> getByStatus(String status) {
        return quotationRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Quotation getById(String id) {
        return quotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quotation not found: " + id));
    }

    public Quotation create(QuotationDTO dto, String createdBy) {
        Quotation q = mapToEntity(dto);
        q.setQuotationNumber(generateQuotationNumber());
        q.setStatus(dto.getStatus() != null ? dto.getStatus() : "draft");
        q.setCreatedBy(createdBy);
        recalculate(q);
        Quotation saved = quotationRepository.save(q);
        log.info("[QUOTATION] Created {} for {}", saved.getQuotationNumber(), saved.getClientEmail());
        return saved;
    }

    public Quotation update(String id, QuotationDTO dto) {
        Quotation existing = getById(id);
        mapToEntityMerge(dto, existing);
        recalculate(existing);
        Quotation saved = quotationRepository.save(existing);
        log.info("[QUOTATION] Updated {}", saved.getQuotationNumber());
        return saved;
    }

    public void delete(String id) {
        quotationRepository.deleteById(id);
        log.info("[QUOTATION] Deleted id={}", id);
    }

    // ── Send via email ─────────────────────────────────────────────────────

    public Quotation send(String id) {
        Quotation q = getById(id);
        q.setStatus("sent");
        Quotation saved = quotationRepository.save(q);
        emailService.sendQuotationEmail(saved);
        log.info("[QUOTATION] Sent {} to {}", saved.getQuotationNumber(), saved.getClientEmail());
        return saved;
    }

    // ── Status update ─────────────────────────────────────────────────────

    public Quotation updateStatus(String id, String status) {
        Quotation q = getById(id);
        q.setStatus(status);
        return quotationRepository.save(q);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private String generateQuotationNumber() {
        String dateStr = LocalDate.now().format(QN_DATE_FMT);
        long count = quotationRepository.count() + 1;
        return String.format("QT-%s-%04d", dateStr, count);
    }

    /**
     * Recalculate subtotal, discountAmount, gstAmount, totalAmount
     * from items + discount% + gstPercent%.
     */
    private void recalculate(Quotation q) {
        if (q.getItems() == null || q.getItems().isEmpty()) return;

        BigDecimal sub = q.getItems().stream()
                .map(it -> {
                    BigDecimal qty = BigDecimal.valueOf(it.getQuantity() != null ? it.getQuantity() : 0);
                    BigDecimal price = it.getUnitPrice() != null ? it.getUnitPrice() : BigDecimal.ZERO;
                    return qty.multiply(price);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discPct  = q.getDiscount()   != null ? q.getDiscount()   : BigDecimal.ZERO;
        BigDecimal gstPct   = q.getGstPercent() != null ? q.getGstPercent() : BigDecimal.valueOf(18);

        BigDecimal discAmt  = sub.multiply(discPct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal taxable  = sub.subtract(discAmt);
        BigDecimal gstAmt   = taxable.multiply(gstPct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal total    = taxable.add(gstAmt);

        q.setSubtotal(sub.setScale(2, RoundingMode.HALF_UP));
        q.setDiscountAmount(discAmt);
        q.setGstAmount(gstAmt);
        q.setTotalAmount(total);

        // set validUntil from validDays if not already set
        if (q.getValidUntil() == null && q.getValidDays() != null) {
            q.setValidUntil(LocalDate.now().plusDays(q.getValidDays()));
        }
    }

    private Quotation mapToEntity(QuotationDTO dto) {
        return Quotation.builder()
                .enquiryId(dto.getEnquiryId())
                .clientName(dto.getClientName())
                .clientEmail(dto.getClientEmail())
                .clientPhone(dto.getClientPhone())
                .clientCompany(dto.getClientCompany())
                .clientSegment(dto.getClientSegment())
                .clientAddress(dto.getClientAddress())
                .items(dto.getItems())
                .discount(safeDecimal(dto.getDiscount()))
                .gstPercent(safeDecimal(dto.getGstPercent(), BigDecimal.valueOf(18)))
                .validDays(dto.getValidDays())
                .validUntil(parseDate(dto.getValidUntil()))
                .termsAndConditions(dto.getTermsAndConditions())
                .notes(dto.getNotes())
                .build();
    }

    private void mapToEntityMerge(QuotationDTO dto, Quotation q) {
        q.setEnquiryId(dto.getEnquiryId());
        q.setClientName(dto.getClientName());
        q.setClientEmail(dto.getClientEmail());
        q.setClientPhone(dto.getClientPhone());
        q.setClientCompany(dto.getClientCompany());
        q.setClientSegment(dto.getClientSegment());
        q.setClientAddress(dto.getClientAddress());
        q.setItems(dto.getItems());
        q.setDiscount(safeDecimal(dto.getDiscount()));
        q.setGstPercent(safeDecimal(dto.getGstPercent(), BigDecimal.valueOf(18)));
        q.setValidDays(dto.getValidDays());
        q.setValidUntil(parseDate(dto.getValidUntil()));
        q.setTermsAndConditions(dto.getTermsAndConditions());
        q.setNotes(dto.getNotes());
        if (dto.getStatus() != null) q.setStatus(dto.getStatus());
    }

    private BigDecimal safeDecimal(BigDecimal v) {
        return v != null ? v : BigDecimal.ZERO;
    }

    private BigDecimal safeDecimal(BigDecimal v, BigDecimal fallback) {
        return v != null ? v : fallback;
    }

    private LocalDate parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        try { return LocalDate.parse(s.substring(0, 10)); } catch (Exception e) { return null; }
    }
}
