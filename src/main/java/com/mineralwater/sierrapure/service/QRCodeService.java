package com.mineralwater.sierrapure.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class QRCodeService {

    @Value("${app.base.url}")
    private String baseUrl;

    private static final int QR_WIDTH = 400;
    private static final int QR_HEIGHT = 400;

    /**
     * Generates a QR code PNG byte array for a given batch number.
     * The QR points to the lab report detail page.
     */
    public byte[] generateQRCode(String batchNumber) throws WriterException, IOException {
        String qrContent = buildQRUrl(batchNumber);
        log.debug("Generating QR code for batch: {} → {}", batchNumber, qrContent);

        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        hints.put(EncodeHintType.MARGIN, 2);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix bitMatrix = writer.encode(qrContent, BarcodeFormat.QR_CODE, QR_WIDTH, QR_HEIGHT, hints);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        return outputStream.toByteArray();
    }

    public String buildQRUrl(String batchNumber) {
        return baseUrl + "/lab-reports/batch/" + batchNumber;
    }
}
