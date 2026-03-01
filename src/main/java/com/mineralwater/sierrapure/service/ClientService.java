package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.exception.ResourceNotFoundException;
import com.mineralwater.sierrapure.model.Client;
import com.mineralwater.sierrapure.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {

    private final ClientRepository clientRepository;

    public List<Client> getAllActive() {
        return clientRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }

    public List<Client> getFeatured() {
        return clientRepository.findByIsFeaturedTrueAndIsActiveTrueOrderBySortOrderAsc();
    }

    public List<Client> getBySegment(String segment) {
        return clientRepository.findBySegmentAndIsActiveTrueOrderBySortOrderAsc(segment.toLowerCase());
    }

    public Client getById(String id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
    }

    public Client create(Client client) {
        log.info("Creating client: {}", client.getName());
        return clientRepository.save(client);
    }

    public Client update(String id, Client updated) {
        Client existing = getById(id);
        existing.setName(updated.getName());
        existing.setSegment(updated.getSegment());
        existing.setLogoUrl(updated.getLogoUrl());
        existing.setLogoFileName(updated.getLogoFileName());
        existing.setDescription(updated.getDescription());
        existing.setLocation(updated.getLocation());
        existing.setBottleSizeUsed(updated.getBottleSizeUsed());
        existing.setBottleImages(updated.getBottleImages());
        existing.setTestimonial(updated.getTestimonial());
        existing.setFeatured(updated.isFeatured());
        existing.setSortOrder(updated.getSortOrder());
        existing.setActive(updated.isActive());
        return clientRepository.save(existing);
    }

    public void delete(String id) {
        Client client = getById(id);
        clientRepository.delete(client);
        log.info("Deleted client: {}", client.getName());
    }

    public Client updateLogo(String id, String logoUrl, String logoFileName) {
        Client client = getById(id);
        client.setLogoUrl(logoUrl);
        client.setLogoFileName(logoFileName);
        return clientRepository.save(client);
    }
}
