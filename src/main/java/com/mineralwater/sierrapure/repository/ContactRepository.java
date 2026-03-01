package com.mineralwater.sierrapure.repository;

import com.mineralwater.sierrapure.model.ContactRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends MongoRepository<ContactRequest, String> {

    List<ContactRequest> findByStatusOrderByCreatedAtDesc(String status);

    List<ContactRequest> findBySegmentOrderByCreatedAtDesc(String segment);
}
