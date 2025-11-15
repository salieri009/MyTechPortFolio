package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.domain.ProjectEngagement;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.service.ProjectEngagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for project engagement tracking.
 * Tracks detailed visitor engagement with projects for analytics.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@RestController
@RequestMapping(ApiConstants.API_BASE_PATH + "/engagement")
@Tag(name = "Project Engagement", description = "Project engagement tracking API")
@RequiredArgsConstructor
public class ProjectEngagementController {
    
    private final ProjectEngagementService engagementService;
    
    /**
     * Records a project view engagement.
     * 
     * @param engagement Engagement data
     * @param httpRequest HTTP request for IP and user agent
     * @return Created engagement
     */
    @PostMapping("/track")
    @Operation(summary = "Track project engagement", description = "Records detailed engagement metrics for a project view")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Engagement recorded"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<ApiResponse<ProjectEngagement>> trackEngagement(
            @Valid @RequestBody ProjectEngagement engagement,
            HttpServletRequest httpRequest) {
        
        // Enrich with request data
        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        
        engagement.setIpAddress(hashIpAddress(ipAddress));
        engagement.setUserAgent(userAgent);
        
        ProjectEngagement savedEngagement = engagementService.recordEngagement(engagement);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(savedEngagement));
    }
    
    /**
     * Updates engagement with interaction data.
     * 
     * @param engagementId Engagement ID
     * @param viewDuration View duration in seconds
     * @param scrollDepth Scroll depth percentage
     * @param githubLinkClicked Whether GitHub link was clicked
     * @param demoLinkClicked Whether demo link was clicked
     * @return Success response
     */
    @PatchMapping("/{engagementId}")
    @Operation(summary = "Update engagement", description = "Updates engagement with interaction data")
    public ResponseEntity<ApiResponse<Void>> updateEngagement(
            @Parameter(description = "Engagement ID", required = true)
            @PathVariable String engagementId,
            @RequestParam(required = false) Long viewDuration,
            @RequestParam(required = false) Integer scrollDepth,
            @RequestParam(required = false) Boolean githubLinkClicked,
            @RequestParam(required = false) Boolean demoLinkClicked) {
        
        engagementService.updateEngagement(engagementId, viewDuration, scrollDepth, 
                                         githubLinkClicked, demoLinkClicked);
        
        return ResponseEntity.ok(ApiResponse.success(null));
    }
    
    /**
     * Gets engagement statistics for a project.
     * 
     * @param projectId Project ID
     * @return Engagement statistics
     */
    @GetMapping("/projects/{projectId}/stats")
    @Operation(summary = "Get project engagement stats", description = "Retrieves engagement statistics for a project")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProjectEngagementStats(
            @Parameter(description = "Project ID", required = true)
            @PathVariable String projectId) {
        
        Map<String, Object> stats = engagementService.getProjectEngagementStats(projectId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
    
    /**
     * Gets most engaged projects.
     * 
     * @param limit Number of projects to return
     * @return List of most engaged projects
     */
    @GetMapping("/projects/most-engaged")
    @Operation(summary = "Get most engaged projects", description = "Retrieves projects with highest engagement scores")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMostEngagedProjects(
            @Parameter(description = "Number of projects to return", example = "10")
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Map<String, Object>> projects = engagementService.getMostEngagedProjects(limit);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }
    
    /**
     * Extracts client IP address from request.
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
    
    /**
     * Hashes IP address for privacy.
     */
    private String hashIpAddress(String ipAddress) {
        return String.valueOf(ipAddress.hashCode());
    }
}

