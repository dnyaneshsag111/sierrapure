package com.mineralwater.sierrapure.repository;

import com.mineralwater.sierrapure.model.ImageAsset;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ImageAssetRepository extends MongoRepository<ImageAsset, String> {
    List<ImageAsset> findByCategoryOrderByUploadedAtDesc(String category);
    Optional<ImageAsset> findByStoredName(String storedName);
    Optional<ImageAsset> findByCategoryAndLabel(String category, String label);
}
