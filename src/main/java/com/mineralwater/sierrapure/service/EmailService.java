package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.model.ContactRequest;
import com.mineralwater.sierrapure.model.Quotation;
import com.mineralwater.sierrapure.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final TemplateEngine templateEngine;

    /** Null-safe: absent when spring.mail.* is not configured */
    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.from:dnyaneshsag@gmail.com}")
    private String fromEmail;

    @Value("${app.mail.admin:dnyaneshsag@gmail.com}")
    private String adminEmail;

    @Value("${app.base.url:http://localhost:5173}")
    private String baseUrl;

    /**
     * true  → print rendered email to console (no SMTP needed — dev/CI mode).
     * false → send via JavaMailSender (production).
     * Override via env var: MAIL_TEST_MODE=true
     */
    @Value("${app.mail.test-mode:false}")
    private boolean testMode;

    private static final DateTimeFormatter DT_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    // ─────────────────────────────────────────────────────────────────
    //  Public API
    // ─────────────────────────────────────────────────────────────────

    /**
     * Premium auto-reply sent to the customer the moment an enquiry is submitted.
     * Template: email/enquiry-confirmation.html
     */
    @Async
    public void sendEnquiryConfirmation(ContactRequest enquiry) {
        String subject = "We received your enquiry, " + enquiry.getName()
                + " \u2014 Sierra Pure will be in touch within 24 hrs";

        String refId = enquiry.getId() != null
                ? enquiry.getId().substring(0, Math.min(8, enquiry.getId().length())).toUpperCase()
                : "N/A";

        Context ctx = new Context();
        ctx.setVariable("name",        enquiry.getName());
        ctx.setVariable("email",       enquiry.getEmail());
        ctx.setVariable("phone",       nullSafe(enquiry.getPhone(),   "Not provided"));
        ctx.setVariable("company",     nullSafe(enquiry.getCompany(), "Not provided"));
        ctx.setVariable("segment",     capitalise(enquiry.getSegment()));
        ctx.setVariable("bottleSizes", joinSizes(enquiry));
        ctx.setVariable("customLabel", enquiry.isCustomLabel() ? "Yes \u2014 Custom label required" : "No");
        ctx.setVariable("message",     enquiry.getMessage());
        ctx.setVariable("refId",       refId);
        ctx.setVariable("submittedAt", LocalDateTime.now().format(DT_FMT));
        ctx.setVariable("baseUrl",     baseUrl);

        String html = templateEngine.process("email/enquiry-confirmation", ctx);
        send(enquiry.getEmail(), subject, html);
    }

    /**
     * Rich admin notification with urgency banner, full details, Reply-To set to customer.
     * Template: email/enquiry-admin-alert.html
     */
    @Async
    public void sendNewEnquiryAlert(ContactRequest enquiry) {
        String companyOrSegment = (enquiry.getCompany() != null && !enquiry.getCompany().isBlank())
                ? enquiry.getCompany() : enquiry.getSegment();
        String subject = "[NEW ENQUIRY] " + enquiry.getName()
                + " \u2014 " + companyOrSegment
                + " [" + (enquiry.getSegment() != null ? enquiry.getSegment().toUpperCase() : "") + "]";

        Context ctx = new Context();
        ctx.setVariable("name",        enquiry.getName());
        ctx.setVariable("email",       enquiry.getEmail());
        ctx.setVariable("phone",       nullSafe(enquiry.getPhone(),   "\u2014"));
        ctx.setVariable("company",     nullSafe(enquiry.getCompany(), "\u2014"));
        ctx.setVariable("segment",     enquiry.getSegment() != null ? enquiry.getSegment().toUpperCase() : "\u2014");
        ctx.setVariable("bottleSizes", joinSizes(enquiry));
        ctx.setVariable("customLabel", enquiry.isCustomLabel() ? "Yes" : "No");
        ctx.setVariable("message",     enquiry.getMessage());
        ctx.setVariable("receivedAt",  LocalDateTime.now().format(DT_FMT));
        ctx.setVariable("baseUrl",     baseUrl);

        String html = templateEngine.process("email/enquiry-admin-alert", ctx);
        sendWithReplyTo(adminEmail, subject, html, enquiry.getEmail());
    }

    /**
     * 6-digit OTP email for password reset — valid 15 minutes.
     * Template: email/password-reset-otp.html
     */
    @Async
    public void sendPasswordResetOtp(User user, String otp) {
        String subject = "Sierra Pure \u2014 Password Reset OTP";

        Context ctx = new Context();
        ctx.setVariable("name",   user.getName());
        ctx.setVariable("otp",    otp);
        ctx.setVariable("expiry", LocalDateTime.now().plusMinutes(15).format(DT_FMT));

        String html = templateEngine.process("email/password-reset-otp", ctx);
        send(user.getEmail(), subject, html);
    }

    /**
     * Welcome email for newly created accounts.
     * Template: email/welcome.html
     */
    @Async
    public void sendWelcomeEmail(User user) {
        String roleName = switch (user.getRole()) {
            case "ADMIN"       -> "Administrator";
            case "LAB_ANALYST" -> "Lab Analyst";
            default            -> "Client";
        };
        String subject = "Welcome to Sierra Pure \u2014 Your account is ready";

        Context ctx = new Context();
        ctx.setVariable("name",     user.getName());
        ctx.setVariable("email",    user.getEmail());
        ctx.setVariable("role",     user.getRole());
        ctx.setVariable("roleName", roleName);
        ctx.setVariable("baseUrl",  baseUrl);

        String html = templateEngine.process("email/welcome", ctx);
        send(user.getEmail(), subject, html);
    }

    /**
     * Sends a formatted quotation email to the client.
     * Template: email/quotation.html
     */
    @Async
    public void sendQuotationEmail(Quotation q) {
        if (q.getClientEmail() == null || q.getClientEmail().isBlank()) {
            log.warn("[EMAIL] Quotation {} has no client email — skipping send", q.getQuotationNumber());
            return;
        }
        String subject = "Your Quotation from Sierra Pure — " + q.getQuotationNumber();

        Context ctx = new Context();
        ctx.setVariable("quotationNumber", q.getQuotationNumber());
        ctx.setVariable("clientName",      q.getClientName());
        ctx.setVariable("clientCompany",   nullSafe(q.getClientCompany(), ""));
        ctx.setVariable("items",           q.getItems());
        ctx.setVariable("subtotal",        formatAmount(q.getSubtotal()));
        ctx.setVariable("discount",        q.getDiscount() != null ? q.getDiscount().toPlainString() : "0");
        ctx.setVariable("discountAmount",  formatAmount(q.getDiscountAmount()));
        ctx.setVariable("gstPercent",      q.getGstPercent() != null ? q.getGstPercent().toPlainString() : "18");
        ctx.setVariable("gstAmount",       formatAmount(q.getGstAmount()));
        ctx.setVariable("totalAmount",     formatAmount(q.getTotalAmount()));
        ctx.setVariable("validUntil",      q.getValidUntil() != null ? q.getValidUntil().toString() : "—");
        ctx.setVariable("termsAndConditions", nullSafe(q.getTermsAndConditions(), ""));
        ctx.setVariable("notes",           nullSafe(q.getNotes(), ""));
        ctx.setVariable("baseUrl",         baseUrl);
        ctx.setVariable("createdAt",       LocalDateTime.now().format(DT_FMT));

        String html = templateEngine.process("email/quotation", ctx);
        send(q.getClientEmail(), subject, html);
    }

    // ─────────────────────────────────────────────────────────────────
    //  Internal helpers
    // ─────────────────────────────────────────────────────────────────

    /** Delegates to sendWithReplyTo with no Reply-To header. */
    private void send(String to, String subject, String html) {
        sendWithReplyTo(to, subject, html, null);
    }

    /**
     * Central dispatch.
     * <ul>
     *   <li>testMode=true  → pretty-print to console, no SMTP.</li>
     *   <li>testMode=false → send via JavaMailSender; warn loudly if unconfigured.</li>
     * </ul>
     */
    private void sendWithReplyTo(String to, String subject, String html, String replyTo) {
        if (testMode) {
            logEmail(to, subject, html);
            return;
        }
        if (mailSender == null) {
            log.warn("[EMAIL] JavaMailSender not configured. "
                    + "Set app.mail.test-mode=true or configure spring.mail.* "
                    + "to send real emails. Skipped: to={} subject={}", to, subject);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "Sierra Pure");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            if (replyTo != null && !replyTo.isBlank()) {
                helper.setReplyTo(replyTo);
            }
            mailSender.send(message);
            log.info("[EMAIL] Sent  to={} subject={}", to, subject);
        } catch (Exception e) {
            log.error("[EMAIL] Failed to={} subject={} error={}", to, subject, e.getMessage());
        }
    }

    /** Strips HTML tags and prints a clean preview when testMode is on. */
    private void logEmail(String to, String subject, String html) {
        String plain = html
                .replaceAll("<[^>]+>", " ")
                .replaceAll("&nbsp;",  " ")
                .replaceAll("&amp;",   "&")
                .replaceAll("&lt;",    "<")
                .replaceAll("&gt;",    ">")
                .replaceAll("&middot;","·")
                .replaceAll("&copy;",  "©")
                .replaceAll("[ \t]{2,}", " ")
                .replaceAll("(\r?\n){3,}", "\n\n")
                .strip();

        String sep = "=".repeat(62);
        log.info("\n{}\n  [EMAIL TEST MODE — NOT SENT]\n  To      : {}\n  From    : {}\n  Subject : {}\n{}\n{}\n{}",
                sep, to, fromEmail, subject, sep, plain, sep);
    }

    // ── tiny utilities ────────────────────────────────────────────────

    private String nullSafe(String value, String fallback) {
        return (value != null && !value.isBlank()) ? value : fallback;
    }

    private String formatAmount(java.math.BigDecimal v) {
        if (v == null) return "0.00";
        return String.format("%.2f", v);
    }

    private String capitalise(String s) {
        if (s == null || s.isBlank()) return "\u2014";
        return Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase();
    }

    private String joinSizes(ContactRequest e) {
        return (e.getBottleSizes() != null && !e.getBottleSizes().isEmpty())
                ? String.join(", ", e.getBottleSizes())
                : "Not specified";
    }
}
