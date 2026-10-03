package com.gameverse.modules.organization.service;

import com.gameverse.core.storage.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Service
public class BrandKitImageService {

    private final FileStorageService fileStorageService;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int MIN_WIDTH = 400;
    private static final int MIN_HEIGHT = 400;
    private static final List<String> SUPPORTED_TYPES = Arrays.asList("image/png", "image/svg+xml", "image/webp");

    public BrandKitImageService(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    public String uploadAndProcessLogo(String orgId, String logoType, MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null || !SUPPORTED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Unsupported file format. Please upload PNG, SVG, or WebP.");
        }

        byte[] fileBytes = file.getBytes();
        String extension = "webp"; // We convert PNG to WebP, or keep WebP
        
        if ("image/svg+xml".equals(contentType)) {
            // Cannot easily validate dimensions of SVG using ImageIO, so just save it
            extension = "svg";
        } else {
            // Validate dimensions for PNG/WebP
            try (InputStream is = new ByteArrayInputStream(fileBytes)) {
                BufferedImage image = ImageIO.read(is);
                if (image == null) {
                    throw new IllegalArgumentException("Invalid image file");
                }
                if (image.getWidth() < MIN_WIDTH || image.getHeight() < MIN_HEIGHT) {
                    throw new IllegalArgumentException("Image dimensions must be at least 400x400px");
                }

                if ("image/png".equals(contentType)) {
                    // Convert PNG to WebP
                    ByteArrayOutputStream os = new ByteArrayOutputStream();
                    boolean success = ImageIO.write(image, "webp", os);
                    if (success) {
                        fileBytes = os.toByteArray();
                    }
                }
            }
        }

        // Generate unique filename
        String fileName = orgId + "_" + logoType + "_" + System.currentTimeMillis() + "." + extension;
        
        try (InputStream is = new ByteArrayInputStream(fileBytes)) {
            return fileStorageService.storeFile(is, "org-brands", fileName);
        }
    }
}
