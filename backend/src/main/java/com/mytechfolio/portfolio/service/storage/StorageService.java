package com.mytechfolio.portfolio.service.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Optional;

/**
 * Storage service interface for file uploads.
 * Supports multiple storage providers (Azure Blob Storage, Local, S3, etc.).
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public interface StorageService {
    
    /**
     * Uploads a file and returns the URL.
     * 
     * @param file Multipart file to upload
     * @param path Storage path (e.g., "projects/{projectId}/{fileName}")
     * @return URL to the uploaded file
     * @throws StorageException if upload fails
     */
    String uploadFile(MultipartFile file, String path) throws StorageException;
    
    /**
     * Uploads a file from InputStream.
     * 
     * @param inputStream File input stream
     * @param fileName Original file name
     * @param contentType MIME type
     * @param path Storage path
     * @return URL to the uploaded file
     * @throws StorageException if upload fails
     */
    String uploadFile(InputStream inputStream, String fileName, String contentType, String path) throws StorageException;
    
    /**
     * Deletes a file.
     * 
     * @param path Storage path
     * @throws StorageException if deletion fails
     */
    void deleteFile(String path) throws StorageException;
    
    /**
     * Gets file URL.
     * 
     * @param path Storage path
     * @return File URL or empty if not found
     */
    Optional<String> getFileUrl(String path);
    
    /**
     * Checks if file exists.
     * 
     * @param path Storage path
     * @return true if file exists
     */
    boolean fileExists(String path);
    
    /**
     * Generates thumbnail for image.
     * 
     * @param fileUrl Original image URL
     * @param width Thumbnail width
     * @param height Thumbnail height
     * @return Thumbnail URL
     * @throws StorageException if thumbnail generation fails
     */
    String generateThumbnail(String fileUrl, int width, int height) throws StorageException;
    
    /**
     * Storage exception.
     */
    class StorageException extends Exception {
        public StorageException(String message) {
            super(message);
        }
        
        public StorageException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}

