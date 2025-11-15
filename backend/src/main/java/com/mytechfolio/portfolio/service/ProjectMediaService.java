package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Project;
import com.mytechfolio.portfolio.domain.ProjectMedia;
import com.mytechfolio.portfolio.dto.request.MediaUploadRequest;
import com.mytechfolio.portfolio.dto.response.ProjectMediaResponse;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.ProjectMediaMapper;
import com.mytechfolio.portfolio.repository.ProjectMediaRepository;
import com.mytechfolio.portfolio.repository.ProjectRepository;
import com.mytechfolio.portfolio.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for project media management.
 * Handles file uploads, gallery management, and media operations.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectMediaService {
    
    private final ProjectMediaRepository mediaRepository;
    private final ProjectRepository projectRepository;
    private final StorageService storageService;
    private final ProjectMediaMapper mediaMapper;
    
    /**
     * Uploads media file for a project.
     * 
     * @param file Multipart file
     * @param request Upload request with metadata
     * @return ProjectMediaResponse
     */
    @Transactional
    public ProjectMediaResponse uploadMedia(MultipartFile file, MediaUploadRequest request) {
        // Validate project exists
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", request.getProjectId()));
        
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        // Determine storage path
        String storagePath = String.format("projects/%s/%s", request.getProjectId(), file.getOriginalFilename());
        
        try {
            // Upload file
            String fileUrl = storageService.uploadFile(file, storagePath);
            
            // Generate thumbnail if image
            String thumbnailUrl = null;
            if (file.getContentType() != null && file.getContentType().startsWith("image/")) {
                try {
                    thumbnailUrl = storageService.generateThumbnail(fileUrl, 300, 300);
                } catch (Exception e) {
                    log.warn("Failed to generate thumbnail: {}", e.getMessage());
                }
            }
            
            // Determine display order
            Integer displayOrder = request.getDisplayOrder();
            if (displayOrder == null) {
                long count = mediaRepository.countByProjectId(request.getProjectId());
                displayOrder = (int) count;
            }
            
            // If this is primary, unset other primary media
            if (request.getIsPrimary()) {
                mediaRepository.findByProjectIdAndIsPrimaryTrue(request.getProjectId())
                        .ifPresent(existing -> {
                            existing.setIsPrimary(false);
                            mediaRepository.save(existing);
                        });
            }
            
            // Create media entity
            ProjectMedia media = ProjectMedia.builder()
                    .projectId(request.getProjectId())
                    .fileName(file.getOriginalFilename())
                    .fileUrl(fileUrl)
                    .thumbnailUrl(thumbnailUrl)
                    .fileType(file.getContentType())
                    .mimeType(file.getContentType())
                    .fileSize(file.getSize())
                    .type(request.getType())
                    .displayOrder(displayOrder)
                    .altText(request.getAltText())
                    .caption(request.getCaption())
                    .description(request.getDescription())
                    .isPrimary(request.getIsPrimary())
                    .storageProvider("local") // TODO: Make configurable
                    .storagePath(storagePath)
                    .build();
            
            ProjectMedia saved = mediaRepository.save(media);
            log.info("Media uploaded successfully: {} for project {}", saved.getId(), request.getProjectId());
            
            return mediaMapper.toResponse(saved);
        } catch (StorageService.StorageException e) {
            log.error("Failed to upload media: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload media: " + e.getMessage(), e);
        }
    }
    
    /**
     * Gets all media for a project.
     * 
     * @param projectId Project ID
     * @return List of media responses
     */
    public List<ProjectMediaResponse> getProjectMedia(String projectId) {
        List<ProjectMedia> media = mediaRepository.findByProjectIdOrderByDisplayOrderAsc(projectId);
        return media.stream()
                .map(mediaMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets active media for a project (for gallery display).
     * 
     * @param projectId Project ID
     * @return List of active media
     */
    public List<ProjectMediaResponse> getActiveProjectMedia(String projectId) {
        List<ProjectMedia> media = mediaRepository.findByProjectIdAndIsActiveTrueOrderByDisplayOrderAsc(projectId);
        return media.stream()
                .map(mediaMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets primary/featured media for a project.
     * 
     * @param projectId Project ID
     * @return Primary media or null
     */
    public ProjectMediaResponse getPrimaryMedia(String projectId) {
        return mediaRepository.findByProjectIdAndIsPrimaryTrue(projectId)
                .map(mediaMapper::toResponse)
                .orElse(null);
    }
    
    /**
     * Deletes media.
     * 
     * @param mediaId Media ID
     */
    @Transactional
    public void deleteMedia(String mediaId) {
        ProjectMedia media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectMedia", mediaId));
        
        try {
            // Delete from storage
            storageService.deleteFile(media.getStoragePath());
            
            // Delete from database
            mediaRepository.delete(media);
            log.info("Media deleted: {}", mediaId);
        } catch (StorageService.StorageException e) {
            log.error("Failed to delete media file: {}", e.getMessage(), e);
            // Still delete from database even if file deletion fails
            mediaRepository.delete(media);
        }
    }
    
    /**
     * Updates media metadata.
     * 
     * @param mediaId Media ID
     * @param altText Alt text
     * @param caption Caption
     * @param displayOrder Display order
     * @param isPrimary Is primary
     * @return Updated media response
     */
    @Transactional
    public ProjectMediaResponse updateMedia(String mediaId, String altText, String caption, 
                                           Integer displayOrder, Boolean isPrimary) {
        ProjectMedia media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectMedia", mediaId));
        
        if (altText != null) {
            media.setAltText(altText);
        }
        if (caption != null) {
            media.setCaption(caption);
        }
        if (displayOrder != null) {
            media.setDisplayOrder(displayOrder);
        }
        if (isPrimary != null && isPrimary) {
            // Unset other primary media
            mediaRepository.findByProjectIdAndIsPrimaryTrue(media.getProjectId())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(mediaId)) {
                            existing.setIsPrimary(false);
                            mediaRepository.save(existing);
                        }
                    });
            media.setIsPrimary(true);
        }
        
        ProjectMedia updated = mediaRepository.save(media);
        return mediaMapper.toResponse(updated);
    }
}

