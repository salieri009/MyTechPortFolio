package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.domain.Resume;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

/**
 * REST controller for resume/CV management.
 * Handles resume retrieval and download tracking.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@RestController
@RequestMapping(ApiConstants.API_BASE_PATH + "/resumes")
@Tag(name = "Resumes", description = "Resume/CV management API")
@RequiredArgsConstructor
public class ResumeController {
    
    private final ResumeService resumeService;
    
    /**
     * Gets all available resumes.
     * 
     * @return List of resumes
     */
    @GetMapping
    @Operation(summary = "Get all resumes", description = "Retrieves list of all available resume versions")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<List<Resume>>> getAllResumes() {
        List<Resume> resumes = resumeService.getAllResumes();
        return ResponseEntity.ok(ApiResponse.success(resumes));
    }
    
    /**
     * Gets the primary (active) resume.
     * 
     * @return Primary resume
     */
    @GetMapping("/primary")
    @Operation(summary = "Get primary resume", description = "Retrieves the active primary resume")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "No active resume found")
    })
    public ResponseEntity<ApiResponse<Resume>> getPrimaryResume() {
        Resume resume = resumeService.getPrimaryResume();
        return ResponseEntity.ok(ApiResponse.success(resume));
    }
    
    /**
     * Downloads a resume file.
     * Tracks download for analytics.
     * 
     * @param id Resume ID
     * @return Resume file as download
     */
    @GetMapping("/{id}/download")
    @Operation(summary = "Download resume", description = "Downloads resume file and tracks download")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Resume file"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Resume not found")
    })
    public ResponseEntity<Resource> downloadResume(@PathVariable String id) {
        Resume resume = resumeService.recordDownload(id);
        
        try {
            // In production, this would fetch from Azure Blob Storage
            // For now, assuming fileUrl is a valid file path or URL
            Path filePath = Paths.get(resume.getFileUrl());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                log.error("Resume file not found or not readable: {}", resume.getFileUrl());
                return ResponseEntity.notFound().build();
            }
            
            String contentType = determineContentType(resume.getFileType());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + resume.getFileName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            log.error("Invalid resume file URL: {}", resume.getFileUrl(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Gets resume download statistics.
     * 
     * @return Download statistics by version
     */
    @GetMapping("/statistics")
    @Operation(summary = "Get download statistics", description = "Retrieves download statistics for all resumes")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getDownloadStatistics() {
        Map<String, Long> statistics = resumeService.getDownloadStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }
    
    /**
     * Determines content type from file type.
     */
    private String determineContentType(String fileType) {
        if (fileType == null) {
            return "application/octet-stream";
        }
        return switch (fileType.toLowerCase()) {
            case "pdf" -> "application/pdf";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "doc" -> "application/msword";
            default -> "application/octet-stream";
        };
    }
}

