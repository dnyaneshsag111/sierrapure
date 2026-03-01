package com.mineralwater.sierrapure.repository;

import com.mineralwater.sierrapure.model.Quotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationRepository extends MongoRepository<Quotation, String> {

    List<Quotation> findAllByOrderByCreatedAtDesc();

    List<Quotation> findByStatusOrderByCreatedAtDesc(String status);

    List<Quotation> findByClientEmailOrderByCreatedAtDesc(String email);

    Optional<Quotation> findByQuotationNumber(String quotationNumber);

    long countByStatus(String status);
}
