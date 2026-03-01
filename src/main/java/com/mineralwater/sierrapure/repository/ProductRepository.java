package com.mineralwater.sierrapure.repository;

import com.mineralwater.sierrapure.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByIsActiveTrueOrderBySortOrderAsc();

    List<Product> findByIsActiveTrueAndSizeOrderBySortOrderAsc(String size);

    List<Product> findByIsActiveTrueAndTargetSegmentsContainingOrderBySortOrderAsc(String segment);

    List<Product> findByIsActiveTrueAndCategoryOrderBySortOrderAsc(String category);
}
