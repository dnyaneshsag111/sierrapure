package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.model.ContactRequest;
import com.mineralwater.sierrapure.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@sierrapure.in}")
    private String fromEmail;

    @Value("${app.mail.admin:admin@sierrapure.in}")
    private String adminEmail;

    @Value("${app.base.url:http://localhost:5173}")
    private String baseUrl;

    // ── Public facing ─────────────────────────────────────────────────

    /** Sent to the customer who submitted the contact form */
    @Async
    public void sendEnquiryConfirmation(ContactRequest enquiry) {
        String subject = "Thank you for contacting Sierra Pure — " + enquiry.getName();
        String html = """
            <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2eaf4">
              <div style="background:linear-gradient(135deg,#0A2342,#1B6CA8);padding:32px 40px">
                <h1 style="color:white;margin:0;font-size:24px">Sierra Pure</h1>
                <p style="color:rgba(255,255,255,0.75);margin:6px 0 0">Premium Mineral Water</p>
              </div>
              <div style="padding:40px">
                <h2 style="color:#0A2342;margin-top:0">Thank you, %s!</h2>
                <p style="color:#5C6B85;line-height:1.7">We have received your enquiry and our team will get back to you within <strong>24 hours</strong>.</p>
                <div style="background:#F8FBFF;border-radius:8px;padding:20px;margin:24px 0;border-left:4px solid #1B6CA8">
                  <p style="margin:0;color:#0A2342"><strong>Your Enquiry Summary:</strong></p>
                  <p style="margin:8px 0 0;color:#5C6B85">Segment: %s | Bottle Sizes: %s | Custom Label: %s</p>
                </div>
                <p style="color:#5C6B85;line-height:1.7">Meanwhile, you can browse our <a href="%s/lab-reports" style="color:#1B6CA8">latest lab reports</a> or explore our <a href="%s/products" style="color:#1B6CA8">product range</a>.</p>
                <p style="color:#5C6B85">Best regards,<br><strong>Sierra Pure Team</strong></p>
              </div>
              <div style="background:#F8FBFF;padding:20px 40px;text-align:center;border-top:1px solid #e2eaf4">
                <p style="margin:0;color:#9BADB7;font-size:12px">Sierra Pure | Purity You Can Trust | sierrapure.in</p>
              </div>
            </div>
            """.formatted(
                enquiry.getName(),
                enquiry.getSegment(),
                enquiry.getBottleSizes() != null ? String.join(", ", enquiry.getBottleSizes()) : "—",
                enquiry.isCustomLabel() ? "Yes" : "No",
                baseUrl, baseUrl
        );
        send(enquiry.getEmail(), subject, html);
    }

    /** Sent to admin when a new enquiry comes in */
    @Async
    public void sendNewEnquiryAlert(ContactRequest enquiry) {
        String subject = "🔔 New Enquiry from " + enquiry.getName() + " [" + enquiry.getSegment() + "]";
        String html = """
            <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#0A2342;padding:24px 32px">
                <h2 style="color:white;margin:0;font-size:18px">New Enquiry Received</h2>
              </div>
              <div style="padding:32px;background:#fff;border:1px solid #e2eaf4">
                <table style="width:100%;border-collapse:collapse">
                  <tr><td style="padding:8px;color:#0A2342;font-weight:bold;width:140px">Name</td><td style="padding:8px;color:#5C6B85">%s</td></tr>
                  <tr style="background:#F8FBFF"><td style="padding:8px;color:#0A2342;font-weight:bold">Email</td><td style="padding:8px;color:#5C6B85">%s</td></tr>
                  <tr><td style="padding:8px;color:#0A2342;font-weight:bold">Phone</td><td style="padding:8px;color:#5C6B85">%s</td></tr>
                  <tr style="background:#F8FBFF"><td style="padding:8px;color:#0A2342;font-weight:bold">Company</td><td style="padding:8px;color:#5C6B85">%s</td></tr>
                  <tr><td style="padding:8px;color:#0A2342;font-weight:bold">Segment</td><td style="padding:8px;color:#5C6B85">%s</td></tr>
                  <tr style="background:#F8FBFF"><td style="padding:8px;color:#0A2342;font-weight:bold">Bottle Sizes</td><td style="padding:8px;color:#5C6B85">%s</td></tr>
                  <tr><td style="padding:8px;color:#0A2342;font-weight:bold">Custom Label</td><td style="padding:8px;color:#5C6B85">%s</td></tr>
                  <tr style="background:#F8FBFF"><td style="padding:8px;color:#0A2342;font-weight:bold">Message</td><td style="padding:8px;color:#5C6B85">%s</td></tr>
                </table>
                <div style="margin-top:24px">
                  <a href="%s/admin/enquiries" style="background:#1B6CA8;color:white;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:600">View in Admin Panel →</a>
                </div>
              </div>
            </div>
            """.formatted(
                enquiry.getName(), enquiry.getEmail(), enquiry.getPhone(),
                enquiry.getCompany(), enquiry.getSegment(),
                enquiry.getBottleSizes() != null ? String.join(", ", enquiry.getBottleSizes()) : "—",
                enquiry.isCustomLabel() ? "Yes" : "No",
                enquiry.getMessage(),
                baseUrl
        );
        send(adminEmail, subject, html);
    }

    /** Welcome email for new registered users */
    @Async
    public void sendWelcomeEmail(User user) {
        String roleName = switch (user.getRole()) {
            case "ADMIN"       -> "Administrator";
            case "LAB_ANALYST" -> "Lab Analyst";
            default            -> "Client";
        };
        String subject = "Welcome to Sierra Pure — Your account is ready";
        String html = """
            <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2eaf4">
              <div style="background:linear-gradient(135deg,#0A2342,#1B6CA8);padding:32px 40px">
                <h1 style="color:white;margin:0">Welcome to Sierra Pure</h1>
              </div>
              <div style="padding:40px">
                <h2 style="color:#0A2342;margin-top:0">Hello, %s! 👋</h2>
                <p style="color:#5C6B85;line-height:1.7">Your account has been created with role: <strong>%s</strong></p>
                <a href="%s/admin" style="background:linear-gradient(135deg,#0A2342,#1B6CA8);color:white;padding:14px 28px;border-radius:24px;text-decoration:none;font-weight:600;display:inline-block;margin-top:8px">Access Portal →</a>
              </div>
            </div>
            """.formatted(user.getName(), roleName, baseUrl);
        send(user.getEmail(), subject, html);
    }

    // ── Internal helper ───────────────────────────────────────────────

    private void send(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "Sierra Pure");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to {} | Subject: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
