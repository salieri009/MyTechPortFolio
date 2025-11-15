package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.request.MediaUploadRequest;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.ProjectMediaResponse;
import com.mytechfolio.portfolio.service.ProjectMediaService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller for project media management.
 * Handles file uploads, gallery management, and media operations.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@RestController
@RequestMapping(ApiConstants.API_BASE_PATH + "/projects/{projectId}/media")
@Tag(name = "Project Media", description = "Project media management API")
@RequiredArgsConstructor
public class ProjectMediaController {
    
    private final ProjectMediaService mediaService;
    
    /**
     * Uploads media file for a project.
     * 
     * @param projectId Project ID
     * @param file Multipart file
     * @param request Upload request
     * @return Created media response
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload project media", 
               description = "Uploads an image, video, or document for a project")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Media uploaded successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file or request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ApiResponse<ProjectMediaResponse>> uploadMedia(
            @Parameter(description = "Project ID", required = true)
            @PathVariable String projectId,
            @Parameter(description = "Media file", required = true)
            @RequestPart("file") MultipartFile file,
            @Parameter(description = "Upload metadata")
            @RequestPart(value = "request", required = false) MediaUploadRequest request) {
        
        // Create request if not provided
        if (request == null) {
            request = MediaUploadRequest.builder()
                    .projectId(projectId)
                    .type(com.mytechfolio.portfolio.domain.ProjectMedia.MediaType.SCREENSHOT)
                    .build();
        } else {
            // Ensure projectId matches
            request.setProjectId(projectId);
        }
        
        ProjectMediaResponse response = mediaService.uploadMedia(file, request);
        return ResponseUtil.created(response, "Media uploaded successfully");
    }
    
    /**
     * Gets all media for a project.
     * 
     * @param projectId Project ID
     * @return List of media
     */
    @GetMapping
    @Operation(summary = "Get project media", 
               description = "Returns all media files for a project")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<List<ProjectMediaResponse>>> getProjectMedia(
            @Parameter(description = "Project ID", required = true)
            @PathVariable String projectId) {
        List<ProjectMediaResponse> media = mediaService.getProjectMedia(projectId);
        return ResponseUtil.ok(media);
    }
    
    /**
     * Gets active media for a project (gallery).
     * 
     * @param projectId Project ID
     * @return List of active media
     */
    @GetMapping("/gallery")
    @Operation(summary = "Get project gallery", 
               description = "Returns active media files for gallery display")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<List<ProjectMediaResponse>>> getProjectGallery(
            @Parameter(description = "Project ID", required = true)
            @PathVariable String projectId) {
        List<ProjectMediaResponse> media = mediaService.getActiveProjectMedia(projectId);
        return ResponseUtil.ok(media);
    }
    
    /**
     * Gets primary/featured media for a project.
     * 
     * @param projectId Project ID
     * @return Primary media
     */
    @GetMapping("/primary")
    @Operation(summary = "Get primary media", 
               description = "Returns the primary/featured media for a project")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "No primary media found")
    })
    public ResponseEntity<ApiResponse<ProjectMediaResponse>> getPrimaryMedia(
            @Parameter(description = "Project ID", required = true)
            @PathVariable String projectId) {
        ProjectMediaResponse media = mediaService.getPrimaryMedia(projectId);
        if (media == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                    .body(com.mytechfolio.portfolio.dto.response.ApiResponse.error(
                            "No primary media found for project"));
        }
        return ResponseUtil.ok(media);
    }
    
    /**
     * Updates media metadata.
     * 
     * @param projectId Project ID
     * @param mediaId Media ID
     * @param altText Alt text
     * @param caption Caption
     * @param displayOrder Display order
     * @param isPrimary Is primary
     * @return Updated media
     */
    @PutMapping("/{mediaId}")
    @Operation(summary = "Update media metadata", 
               description = "Updates media metadata (alt text, caption, order, etc.)")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Media not found")
    })
    public ResponseEntity<ApiResponse<ProjectMediaResponse>> updateMedia(
            @Parameter(description = "Project ID", required = true)
            @PathVariable String projectId,
            @Parameter(description = "Media ID", required = true)
            @PathVariable String mediaId,
            @Parameter(description = "Alt text")
            @RequestParam(required = false) String altText,
            @Parameter(description = "Caption")
            @RequestParam(required = false) String caption,
            @Parameter(description = "Display order")
            @RequestParam(required = false) Integer displayOrder,
            @Parameter(description = "Is primary")
            @RequestParam(required = false) Boolean isPrimary) {
        ProjectMediaResponse response = mediaService.updateMedia(mediaId, altText, caption, displayOrder, isPrimary);
        return ResponseUtil.ok(response, "Media updated successfully");
    }
    
    /**
     * Deletes media.
     * 
     * @param projectId Project ID
     * @param mediaId Media ID
     * @return No content
     */
    @DeleteMapping("/{mediaId}")
    @Operation(summary = "Delete media", 
               description = "Deletes a media file from project")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Media not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteMedia(
            @Parameter(description = "Project ID", required = true)
            @PathVariable String projectId,
            @Parameter(description = "Media ID", required = true)
            @PathVariable String mediaId) {
        mediaService.deleteMedia(mediaId);
        return ResponseUtil.noContent();
    }
}

