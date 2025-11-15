package com.mytechfolio.portfolio.service.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

/**
 * Local file system storage service implementation.
 * For development and testing. Production should use Azure Blob Storage.
 * 
 * @author MyTechfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
public class LocalStorageService implements StorageService {
    
    @Value("${app.storage.local.base-path:./uploads}")
    private String basePath;
    
    @Value("${app.storage.local.base-url:http://localhost:8080/uploads}")
    private String baseUrl;
    
    @Override
    public String uploadFile(MultipartFile file, String path) throws StorageException {
        try {
            Path targetPath = Paths.get(basePath, path);
            Files.createDirectories(targetPath.getParent());
            
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = targetPath.resolve(fileName);
            
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            String relativePath = path + "/" + fileName;
            return baseUrl + "/" + relativePath;
        } catch (IOException e) {
            log.error("Failed to upload file: {}", path, e);
            throw new StorageException("Failed to upload file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public String uploadFile(InputStream inputStream, String fileName, String contentType, String path) throws StorageException {
        try {
            Path targetPath = Paths.get(basePath, path);
            Files.createDirectories(targetPath.getParent());
            
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path filePath = targetPath.resolve(uniqueFileName);
            
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            
            String relativePath = path + "/" + uniqueFileName;
            return baseUrl + "/" + relativePath;
        } catch (IOException e) {
            log.error("Failed to upload file: {}", path, e);
            throw new StorageException("Failed to upload file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void deleteFile(String path) throws StorageException {
        try {
            Path filePath = Paths.get(basePath, path);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            log.error("Failed to delete file: {}", path, e);
            throw new StorageException("Failed to delete file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Optional<String> getFileUrl(String path) {
        Path filePath = Paths.get(basePath, path);
        if (Files.exists(filePath)) {
            return Optional.of(baseUrl + "/" + path);
        }
        return Optional.empty();
    }
    
    @Override
    public boolean fileExists(String path) {
        Path filePath = Paths.get(basePath, path);
        return Files.exists(filePath);
    }
    
    @Override
    public String generateThumbnail(String fileUrl, int width, int height) throws StorageException {
        // For local storage, return original URL
        // In production with Azure Blob Storage, use image resizing service
        log.warn("Thumbnail generation not implemented for local storage. Returning original URL.");
        return fileUrl;
    }
}

