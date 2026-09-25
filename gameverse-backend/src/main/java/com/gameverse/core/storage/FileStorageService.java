package com.gameverse.core.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    @Value("${app.storage.upload-dir:uploads}")
    private String uploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Stores a file in a specific subdirectory (e.g., "avatars")
     * Returns the relative URL path to access the file (e.g., "/uploads/avatars/filename.jpg")
     */
    public String storeFile(MultipartFile file, String subDirectory, String newFileName) {
        try {
            Path targetLocation = this.fileStorageLocation.resolve(subDirectory);
            Files.createDirectories(targetLocation);

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetFile = targetLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + subDirectory + "/" + newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + newFileName + ". Please try again!", ex);
        }
    }

    /**
     * Stores an input stream as a file in a specific subdirectory
     */
    public String storeFile(InputStream inputStream, String subDirectory, String newFileName) {
        try {
            Path targetLocation = this.fileStorageLocation.resolve(subDirectory);
            Files.createDirectories(targetLocation);

            Path targetFile = targetLocation.resolve(newFileName);
            Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + subDirectory + "/" + newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + newFileName + ". Please try again!", ex);
        }
    }
}
