package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Resume;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing resume/CV files.
 * Handles resume upload, versioning, and download tracking.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResumeService {
    
    private final ResumeRepository resumeRepository;
    private final EmailService emailService;
    
    /**
     * Gets all active resumes.
     * 
     * @return List of active resumes
     */
    public List<Resume> getAllResumes() {
        log.debug("Fetching all active resumes");
        return resumeRepository.findByIsActiveTrue();
    }
    
    /**
     * Gets the primary (active) resume.
     * 
     * @return Primary resume
     * @throws ResourceNotFoundException if no active resume found
     */
    public Resume getPrimaryResume() {
        log.debug("Fetching primary resume");
        return resumeRepository.findByIsActiveTrueAndIsPublicTrue()
                .stream()
                .findFirst()
                .orElseThrow(() -> {
                    log.warn("No active public resume found");
                    return new ResourceNotFoundException("Resume", "No active resume available");
                });
    }
    
    /**
     * Gets a resume by version.
     * 
     * @param version Resume version
     * @return Resume entity
     * @throws ResourceNotFoundException if resume not found
     */
    public Resume getResumeByVersion(String version) {
        log.debug("Fetching resume with version: {}", version);
        return resumeRepository.findByVersion(version)
                .orElseThrow(() -> {
                    log.warn("Resume not found with version: {}", version);
                    return new ResourceNotFoundException("Resume", version);
                });
    }
    
    /**
     * Gets a resume by ID.
     * 
     * @param id Resume ID
     * @return Resume entity
     * @throws ResourceNotFoundException if resume not found
     */
    public Resume getResumeById(String id) {
        log.debug("Fetching resume with ID: {}", id);
        return resumeRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Resume not found with ID: {}", id);
                    return new ResourceNotFoundException("Resume", id);
                });
    }
    
    /**
     * Records a resume download.
     * Increments download count and updates last downloaded timestamp.
     * 
     * @param id Resume ID
     * @return Updated resume entity
     */
    @Transactional
    public Resume recordDownload(String id) {
        log.info("Recording download for resume ID: {}", id);
        Resume resume = getResumeById(id);
        resume.incrementDownloadCount();
        Resume updatedResume = resumeRepository.save(resume);
        log.info("Resume download recorded. Total downloads: {}", updatedResume.getDownloadCount());
        
        // Send email notification asynchronously
        try {
            emailService.sendResumeDownloadNotification(
                updatedResume.getVersion(),
                null, // Downloader email not available
                "unknown" // IP address not available in service layer
            );
        } catch (Exception e) {
            log.error("Failed to send resume download notification: {}", e.getMessage(), e);
            // Don't fail the download if email fails
        }
        
        return updatedResume;
    }
    
    /**
     * Gets download statistics for all resumes.
     * 
     * @return Map of resume versions to download counts
     */
    public java.util.Map<String, Long> getDownloadStatistics() {
        log.debug("Fetching resume download statistics");
        return resumeRepository.findAll().stream()
                .collect(Collectors.toMap(
                    Resume::getVersion,
                    r -> r.getDownloadCount() != null ? r.getDownloadCount() : 0L
                ));
    }
}

