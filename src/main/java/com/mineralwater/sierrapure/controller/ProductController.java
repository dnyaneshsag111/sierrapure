package com.mineralwater.sierrapure.controller;

import com.mineralwater.sierrapure.dto.ApiResponse;
import com.mineralwater.sierrapure.dto.ProductDTO;
import com.mineralwater.sierrapure.model.ImageAsset;
import com.mineralwater.sierrapure.model.Product;
import com.mineralwater.sierrapure.service.ImageStorageService;
import com.mineralwater.sierrapure.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product catalogue — CRUD and image upload (Admin only for writes)")
public class ProductController {

    private final ProductService productService;
    private final ImageStorageService imageStorageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts(
            @RequestParam(required = false) String segment,
            @RequestParam(required = false) String size) {
        List<Product> products;
        if (segment != null && !segment.isBlank()) products = productService.getProductsBySegment(segment);
        else if (size != null && !size.isBlank())  products = productService.getProductsBySize(size);
        else                                        products = productService.getAllActiveProducts();
        return ResponseEntity.ok(ApiResponse.success(
                products.stream().map(ProductDTO::from).toList(), "Products fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                ProductDTO.from(productService.getProductById(id)), "Product fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.success(
                ProductDTO.from(productService.createProduct(product)), "Product created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable String id, @RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.success(
                ProductDTO.from(productService.updateProduct(id, product)), "Product updated successfully"));
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductDTO>> uploadProductImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) throws IOException {
        Product product = productService.getProductById(id);
        ImageAsset asset = imageStorageService.uploadBottleImage(file, product.getSize());
        Product updated = productService.updateImageUrl(id, asset.getPublicUrl());
        return ResponseEntity.ok(ApiResponse.success(ProductDTO.from(updated), "Product image uploaded successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }
}
