package com.mineralwater.sierrapure.service;

import com.mineralwater.sierrapure.exception.ResourceNotFoundException;
import com.mineralwater.sierrapure.model.ImageAsset;
import com.mineralwater.sierrapure.repository.ImageAssetRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageStorageService {

    private static final List<String> ALLOWED_TYPES =
            List.of("image/jpeg", "image/jpg", "image/png", "image/gif",
                    "image/webp", "image/svg+xml");

    @Value("${app.upload.dir}")
    private String uploadBaseDir;

    @Value("${app.upload.bottles-dir}")
    private String bottlesDir;

    @Value("${app.upload.clients-dir}")
    private String clientsDir;

    @Value("${app.upload.logo-dir}")
    private String logoDir;

    @Value("${app.upload.hero-dir:${app.upload.dir}/hero}")
    private String heroDir;

    private final ImageAssetRepository imageAssetRepository;

    @PostConstruct
    public void initDirectories() {
        createDir(uploadBaseDir);
        createDir(bottlesDir);
        createDir(clientsDir);
        createDir(logoDir);
        createDir(heroDir);
        log.info("Image upload directories initialised at: {}", uploadBaseDir);
    }

    private void createDir(String path) {
        try {
            Files.createDirectories(Paths.get(path));
        } catch (IOException e) {
            log.error("Could not create directory: {}", path, e);
        }
    }

    /** Upload a bottle image (200ml / 500ml / 1000ml) */
    public ImageAsset uploadBottleImage(MultipartFile file, String label) throws IOException {
        return store(file, "BOTTLE", label, bottlesDir);
    }

    /** Upload a client logo */
    public ImageAsset uploadClientLogo(MultipartFile file, String clientName) throws IOException {
        return store(file, "CLIENT_LOGO", clientName, clientsDir);
    }

    /** Upload the Sierra Pure brand logo */
    public ImageAsset uploadSierraLogo(MultipartFile file, String label) throws IOException {
        return store(file, "SIERRA_LOGO", label, logoDir);
    }

    /** Generic store by category */
    public ImageAsset uploadByCategory(MultipartFile file, String category, String label) throws IOException {
        String dir = switch (category.toUpperCase()) {
            case "BOTTLE"       -> bottlesDir;
            case "CLIENT_LOGO"  -> clientsDir;
            case "SIERRA_LOGO"  -> logoDir;
            case "HERO_BOTTLE"  -> heroDir;
            default -> uploadBaseDir;
        };
        return store(file, category.toUpperCase(), label, dir);
    }

    private ImageAsset store(MultipartFile file, String category, String label, String dir) throws IOException {
        validateFile(file);

        String originalName = file.getOriginalFilename();
        String extension    = getExtension(originalName);
        String storedName   = UUID.randomUUID() + "." + extension;
        Path targetPath     = Paths.get(dir, storedName);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String publicUrl = buildPublicUrl(category, storedName);

        // Delete old asset for same category + label if exists (replace mode)
        imageAssetRepository.findByCategoryAndLabel(category, label).ifPresent(old -> {
            try { Files.deleteIfExists(Paths.get(old.getFilePath())); } catch (IOException ignored) {}
            imageAssetRepository.delete(old);
        });

        ImageAsset asset = ImageAsset.builder()
                .category(category)
                .label(label)
                .originalName(originalName)
                .storedName(storedName)
                .filePath(targetPath.toString())
                .publicUrl(publicUrl)
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .build();

        ImageAsset saved = imageAssetRepository.save(asset);
        log.info("Stored image [{}] {} → {}", category, originalName, targetPath);
        return saved;
    }

    /** Serve a file as bytes given storedName */
    public byte[] loadBytes(String storedName) throws IOException {
        ImageAsset asset = imageAssetRepository.findByStoredName(storedName)
                .orElseThrow(() -> new ResourceNotFoundException("Image", "name", storedName));
        return Files.readAllBytes(Paths.get(asset.getFilePath()));
    }

    /** Get content type for serving */
    public String getContentType(String storedName) {
        return imageAssetRepository.findByStoredName(storedName)
                .map(ImageAsset::getContentType)
                .orElse("application/octet-stream");
    }

    public List<ImageAsset> getAllByCategory(String category) {
        return imageAssetRepository.findByCategoryOrderByUploadedAtDesc(category.toUpperCase());
    }

    public void deleteById(String id) throws IOException {
        ImageAsset asset = imageAssetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image", "id", id));
        Files.deleteIfExists(Paths.get(asset.getFilePath()));
        imageAssetRepository.delete(asset);
        log.info("Deleted image: {}", asset.getStoredName());
    }

    // ── helpers ──────────────────────────────────────────────────────────

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "Unsupported file type: " + contentType +
                    ". Allowed: jpeg, png, gif, webp, svg");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File too large. Maximum size is 10MB");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private String buildPublicUrl(String category, String storedName) {
        String sub = switch (category) {
            case "BOTTLE"       -> "bottles";
            case "CLIENT_LOGO"  -> "clients";
            case "SIERRA_LOGO"  -> "logo";
            case "HERO_BOTTLE"  -> "hero";
            default             -> "misc";
        };
        // Relative URL — proxied by Vite in dev, served directly in prod
        return "/api/v1/images/" + sub + "/" + storedName;
    }
}
