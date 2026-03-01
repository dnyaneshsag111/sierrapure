package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.exception.ResourceNotFoundException;
import com.mineralwater.sierrapure.model.Product;
import com.mineralwater.sierrapure.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllActiveProducts() {
        log.debug("Fetching all active products");
        return productRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }

    public Product getProductById(String id) {
        log.debug("Fetching product by id: {}", id);
        return productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    public List<Product> getProductsBySegment(String segment) {
        log.debug("Fetching products by segment: {}", segment);
        return productRepository.findByIsActiveTrueAndTargetSegmentsContainingOrderBySortOrderAsc(segment);
    }

    public List<Product> getProductsBySize(String size) {
        log.debug("Fetching products by size: {}", size);
        return productRepository.findByIsActiveTrueAndSizeOrderBySortOrderAsc(size);
    }

    public Product createProduct(Product product) {
        log.info("Creating new product: {}", product.getName());
        product.setActive(true);
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updated) {
        Product existing = getProductById(id);
        updated.setId(existing.getId());
        updated.setCreatedAt(existing.getCreatedAt());
        log.info("Updating product: {}", id);
        return productRepository.save(updated);
    }

    public Product updateImageUrl(String id, String imageUrl) {
        Product product = getProductById(id);
        product.setImageUrl(imageUrl);
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProductById(id);
        product.setActive(false);
        productRepository.save(product);
        log.info("Soft-deleted product: {}", id);
    }
}
