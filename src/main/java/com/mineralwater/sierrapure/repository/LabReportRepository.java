package com.mineralwater.sierrapure.repository;

import com.mineralwater.sierrapure.model.LabReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface LabReportRepository extends MongoRepository<LabReport, String> {

    Optional<LabReport> findByBatchNumberAndIsPublishedTrue(String batchNumber);

    Optional<LabReport> findByReportIdAndIsPublishedTrue(String reportId);

    Optional<LabReport> findByManufacturingDateAndIsPublishedTrue(LocalDate manufacturingDate);

    Page<LabReport> findByIsPublishedTrueOrderByManufacturingDateDesc(Pageable pageable);

    Optional<LabReport> findTopByIsPublishedTrueOrderByManufacturingDateDesc();

    boolean existsByBatchNumber(String batchNumber);

    boolean existsByReportId(String reportId);
}
