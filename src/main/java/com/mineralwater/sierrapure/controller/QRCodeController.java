package com.mineralwater.sierrapure.controller;

import com.google.zxing.WriterException;
import com.mineralwater.sierrapure.service.QRCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/qr")
@RequiredArgsConstructor
@Slf4j
public class QRCodeController {

    private final QRCodeService qrCodeService;

    /**
     * Returns a QR code PNG image for the given batch number.
     * Used for printing on bottle labels.
     */
    @GetMapping(value = "/{batchNumber}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQRCode(@PathVariable String batchNumber)
            throws WriterException, IOException {
        log.debug("QR code requested for batch: {}", batchNumber);
        byte[] qrImage = qrCodeService.generateQRCode(batchNumber);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrImage);
    }
}
