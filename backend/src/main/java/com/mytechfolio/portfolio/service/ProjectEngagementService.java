package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.ProjectEngagement;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.repository.ProjectEngagementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;

/**
 * Service for tracking project engagement metrics.
 * Helps understand which projects resonate with visitors/recruiters.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProjectEngagementService {
    
    private final ProjectEngagementRepository engagementRepository;
    
    /**
     * Records a project view engagement.
     * 
     * @param engagement Engagement data
     * @return Saved engagement
     */
    public ProjectEngagement recordEngagement(ProjectEngagement engagement) {
        log.debug("Recording engagement for project: {}", engagement.getProjectId());
        engagement.setViewedAt(LocalDateTime.now());
        engagement.setLastInteractionAt(LocalDateTime.now());
        if (engagement.getUpdateSecret() == null || engagement.getUpdateSecret().isBlank()) {
            engagement.setUpdateSecret(UUID.randomUUID().toString());
        }
        return engagementRepository.save(engagement);
    }
    
    /**
     * Updates engagement with interaction data (scroll, time, clicks).
     * 
     * @param engagementId Engagement ID
     * @param viewDuration View duration in seconds
     * @param scrollDepth Scroll depth percentage
     * @param githubLinkClicked Whether GitHub link was clicked
     * @param demoLinkClicked Whether demo link was clicked
     */
    public void updateEngagement(String engagementId, String updateSecret, Long viewDuration, Integer scrollDepth,
                                Boolean githubLinkClicked, Boolean demoLinkClicked) {
        ProjectEngagement engagement = engagementRepository.findById(engagementId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectEngagement", engagementId));
        if (engagement.getUpdateSecret() == null || engagement.getUpdateSecret().isBlank()) {
            throw new AccessDeniedException("Engagement cannot be updated (missing secret); create a new track event");
        }
        if (updateSecret == null || updateSecret.isBlank()
                || !engagement.getUpdateSecret().equals(updateSecret)) {
            throw new AccessDeniedException("Invalid engagement update secret");
        }
        if (viewDuration != null) {
            engagement.setViewDuration(viewDuration);
        }
        if (scrollDepth != null) {
            engagement.setScrollDepth(scrollDepth);
        }
        if (githubLinkClicked != null) {
            engagement.setGithubLinkClicked(githubLinkClicked);
        }
        if (demoLinkClicked != null) {
            engagement.setDemoLinkClicked(demoLinkClicked);
        }
        engagement.setLastInteractionAt(LocalDateTime.now());
        engagementRepository.save(engagement);
        log.debug("Updated engagement: {}", engagementId);
    }
    
    /**
     * Gets engagement statistics for a project.
     * 
     * @param projectId Project ID
     * @return Engagement statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectEngagementStats(String projectId) {
        List<ProjectEngagement> engagements = engagementRepository.findByProjectId(projectId);
        
        long totalViews = engagements.size();
        long highValueEngagements = engagements.stream()
                .filter(ProjectEngagement::isHighValueEngagement)
                .count();
        
        double avgViewDuration = engagements.stream()
                .filter(e -> e.getViewDuration() != null)
                .mapToLong(ProjectEngagement::getViewDuration)
                .average()
                .orElse(0.0);
        
        double avgScrollDepth = engagements.stream()
                .filter(e -> e.getScrollDepth() != null)
                .mapToInt(ProjectEngagement::getScrollDepth)
                .average()
                .orElse(0.0);
        
        long githubClicks = engagements.stream()
                .filter(e -> Boolean.TRUE.equals(e.getGithubLinkClicked()))
                .count();
        
        long demoClicks = engagements.stream()
                .filter(e -> Boolean.TRUE.equals(e.getDemoLinkClicked()))
                .count();
        
        return Map.of(
            "totalViews", totalViews,
            "highValueEngagements", highValueEngagements,
            "avgViewDuration", avgViewDuration,
            "avgScrollDepth", avgScrollDepth,
            "githubClicks", githubClicks,
            "demoClicks", demoClicks,
            "githubClickRate", totalViews > 0 ? (double) githubClicks / totalViews : 0.0,
            "demoClickRate", totalViews > 0 ? (double) demoClicks / totalViews : 0.0
        );
    }
    
    /**
     * Gets most engaged projects (sorted by engagement score).
     * 
     * @param limit Number of projects to return
     * @return List of project IDs with engagement scores
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMostEngagedProjects(int limit) {
        return engagementRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                    ProjectEngagement::getProjectId,
                    Collectors.collectingAndThen(
                        Collectors.toList(),
                        engagements -> {
                            double avgScore = engagements.stream()
                                    .mapToInt(ProjectEngagement::calculateEngagementScore)
                                    .average()
                                    .orElse(0.0);
                            long highValueCount = engagements.stream()
                                    .filter(ProjectEngagement::isHighValueEngagement)
                                    .count();
                            Map<String, Object> result = new HashMap<>();
                            result.put("projectId", engagements.get(0).getProjectId());
                            result.put("avgEngagementScore", avgScore);
                            result.put("totalViews", (long) engagements.size());
                            result.put("highValueEngagements", highValueCount);
                            return result;
                        }
                    )
                ))
                .values()
                .stream()
                .map(map -> (Map<String, Object>) map)
                .sorted((a, b) -> Double.compare(
                    ((Number) b.get("avgEngagementScore")).doubleValue(),
                    ((Number) a.get("avgEngagementScore")).doubleValue()
                ))
                .limit(limit)
                .collect(Collectors.toList());
    }
}

