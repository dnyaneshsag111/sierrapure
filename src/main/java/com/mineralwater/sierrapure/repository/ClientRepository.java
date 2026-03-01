package com.mineralwater.sierrapure.repository;

import com.mineralwater.sierrapure.model.Client;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ClientRepository extends MongoRepository<Client, String> {
    List<Client> findByIsActiveTrueOrderBySortOrderAsc();
    List<Client> findByIsFeaturedTrueAndIsActiveTrueOrderBySortOrderAsc();
    List<Client> findBySegmentAndIsActiveTrueOrderBySortOrderAsc(String segment);
}
