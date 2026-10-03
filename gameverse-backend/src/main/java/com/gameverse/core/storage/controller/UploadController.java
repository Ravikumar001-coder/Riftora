package com.gameverse.core.storage.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.core.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@RestController
@RequestMapping("/v1/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String newFileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        String fileUrl = fileStorageService.storeFile(file, "uploads", newFileName);
        return ResponseEntity.ok(ApiResponse.success(fileUrl));
    }
}
