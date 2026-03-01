package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.dto.ContactRequestDTO;
import com.mineralwater.sierrapure.exception.ResourceNotFoundException;
import com.mineralwater.sierrapure.model.ContactRequest;
import com.mineralwater.sierrapure.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactRepository contactRepository;
    private final EmailService emailService;

    public ContactRequest submitEnquiry(ContactRequestDTO dto) {
        ContactRequest contact = ContactRequest.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .company(dto.getCompany())
                .segment(dto.getSegment())
                .bottleSizes(dto.getBottleSizes())
                .message(dto.getMessage())
                .customLabel(dto.isCustomLabel())
                .status("new")
                .build();
        ContactRequest saved = contactRepository.save(contact);
        log.info("New contact enquiry from: {} ({})", dto.getName(), dto.getEmail());

        // Fire-and-forget emails
        emailService.sendEnquiryConfirmation(saved);
        emailService.sendNewEnquiryAlert(saved);

        return saved;
    }

    public List<ContactRequest> getAll() {
        return contactRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    public ContactRequest getById(String id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry", "id", id));
    }

    public List<ContactRequest> getByStatus(String status) {
        return contactRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public ContactRequest updateStatus(String id, String status) {
        ContactRequest enquiry = getById(id);
        enquiry.setStatus(status);
        log.info("Enquiry {} status updated to: {}", id, status);
        return contactRepository.save(enquiry);
    }
}
