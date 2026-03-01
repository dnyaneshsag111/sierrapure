package com.mineralwater.sierrapure.controller;

import com.mineralwater.sierrapure.dto.ApiResponse;
import com.mineralwater.sierrapure.dto.ImageAssetDTO;
import com.mineralwater.sierrapure.model.ImageAsset;
import com.mineralwater.sierrapure.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Image Upload & Serve API
 *
 * Upload endpoints:
 *   POST /api/v1/images/bottles          - upload bottle image (200ml/500ml/1000ml)
 *   POST /api/v1/images/clients/logo     - upload client logo
 *   POST /api/v1/images/sierra-logo      - upload Sierra Pure brand logo
 *   POST /api/v1/images/upload           - generic upload by category
 *
 * Serve endpoints:
 *   GET  /api/v1/images/bottles/{name}   - serve bottle image
 *   GET  /api/v1/images/clients/{name}   - serve client logo
 *   GET  /api/v1/images/logo/{name}      - serve Sierra logo
 *
 * List / Delete:
 *   GET    /api/v1/images?category=BOTTLE
 *   DELETE /api/v1/images/{id}
 */
@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
@Slf4j
public class ImageController {

    private final ImageStorageService imageStorageService;

    // ── UPLOAD ───────────────────────────────────────────────────────────

    /**
     * Upload a bottle image.
     * @param label   "200ml" | "500ml" | "1000ml"  (sent as form field)
     * @param file    The image file
     */
    @PostMapping(value = "/bottles", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageAssetDTO>> uploadBottle(
            @RequestParam("label") String label,
            @RequestParam("file") MultipartFile file) throws IOException {
        ImageAsset asset = imageStorageService.uploadBottleImage(file, label);
        return ResponseEntity.ok(ApiResponse.success(ImageAssetDTO.from(asset), "Bottle image uploaded successfully"));
    }

    @PostMapping(value = "/clients/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageAssetDTO>> uploadClientLogo(
            @RequestParam("clientName") String clientName,
            @RequestParam("file") MultipartFile file) throws IOException {
        ImageAsset asset = imageStorageService.uploadClientLogo(file, clientName);
        return ResponseEntity.ok(ApiResponse.success(ImageAssetDTO.from(asset), "Client logo uploaded successfully"));
    }

    @PostMapping(value = "/sierra-logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageAssetDTO>> uploadSierraLogo(
            @RequestParam(value = "label", defaultValue = "primary") String label,
            @RequestParam("file") MultipartFile file) throws IOException {
        ImageAsset asset = imageStorageService.uploadSierraLogo(file, label);
        return ResponseEntity.ok(ApiResponse.success(ImageAssetDTO.from(asset), "Sierra logo uploaded successfully"));
    }

    /** Upload hero section bottle image — separate from product bottle images */
    @PostMapping(value = "/hero", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageAssetDTO>> uploadHeroBottle(
            @RequestParam(value = "label", defaultValue = "hero-bottle") String label,
            @RequestParam("file") MultipartFile file) throws IOException {
        ImageAsset asset = imageStorageService.uploadByCategory(file, "HERO_BOTTLE", label);
        return ResponseEntity.ok(ApiResponse.success(ImageAssetDTO.from(asset), "Hero bottle uploaded successfully"));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageAssetDTO>> genericUpload(
            @RequestParam("category") String category,
            @RequestParam("label") String label,
            @RequestParam("file") MultipartFile file) throws IOException {

        ImageAsset asset = imageStorageService.uploadByCategory(file, category, label);
        return ResponseEntity.ok(ApiResponse.success(ImageAssetDTO.from(asset), "Image uploaded successfully"));
    }

    // ── SERVE ────────────────────────────────────────────────────────────

    @GetMapping("/bottles/{filename}")
    public ResponseEntity<byte[]> serveBottle(@PathVariable String filename) throws IOException {
        return serveImage(filename);
    }

    @GetMapping("/clients/{filename}")
    public ResponseEntity<byte[]> serveClientLogo(@PathVariable String filename) throws IOException {
        return serveImage(filename);
    }

    @GetMapping("/logo/{filename}")
    public ResponseEntity<byte[]> serveSierraLogo(@PathVariable String filename) throws IOException {
        return serveImage(filename);
    }

    @GetMapping("/hero/{filename}")
    public ResponseEntity<byte[]> serveHeroBottle(@PathVariable String filename) throws IOException {
        return serveImage(filename);
    }

    private ResponseEntity<byte[]> serveImage(String filename) throws IOException {
        byte[] bytes = imageStorageService.loadBytes(filename);
        String contentType = imageStorageService.getContentType(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(bytes);
    }

    // ── LIST ─────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponse<List<ImageAssetDTO>>> listByCategory(
            @RequestParam(defaultValue = "BOTTLE") String category) {
        List<ImageAssetDTO> assets = imageStorageService.getAllByCategory(category)
                .stream().map(ImageAssetDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.success(assets, "Images fetched successfully"));
    }

    @GetMapping("/bottles")
    public ResponseEntity<ApiResponse<List<ImageAssetDTO>>> listBottles() {
        List<ImageAssetDTO> list = imageStorageService.getAllByCategory("BOTTLE")
                .stream().map(ImageAssetDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.success(list, "Bottle images fetched"));
    }

    @GetMapping("/clients")
    public ResponseEntity<ApiResponse<List<ImageAssetDTO>>> listClientLogos() {
        List<ImageAssetDTO> list = imageStorageService.getAllByCategory("CLIENT_LOGO")
                .stream().map(ImageAssetDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.success(list, "Client logos fetched"));
    }

    @GetMapping("/sierra-logos")
    public ResponseEntity<ApiResponse<List<ImageAssetDTO>>> listSierraLogos() {
        List<ImageAssetDTO> list = imageStorageService.getAllByCategory("SIERRA_LOGO")
                .stream().map(ImageAssetDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.success(list, "Sierra logos fetched"));
    }

    // ── DELETE ───────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteImage(@PathVariable String id) throws IOException {
        imageStorageService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(Map.of("id", id), "Image deleted successfully"));
    }
}
