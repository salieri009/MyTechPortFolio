package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.SeoMetadataResponse;
import com.mytechfolio.portfolio.service.SeoService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for SEO metadata.
 * Provides dynamic meta tags, Open Graph, Twitter Cards, and structured data.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@RestController
@RequestMapping(ApiConstants.API_BASE_PATH + "/seo")
@Tag(name = "SEO", description = "SEO metadata API for dynamic meta tags")
@RequiredArgsConstructor
public class SeoController {
    
    private final SeoService seoService;
    
    /**
     * Gets SEO metadata for home page.
     * 
     * @param locale Language locale (ko, en, ja), default: ko
     * @return SEO metadata
     */
    @GetMapping("/home")
    @Operation(summary = "Get home page SEO metadata", 
               description = "Returns SEO metadata including meta tags, Open Graph, and Twitter Cards for home page")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<SeoMetadataResponse>> getHomePageMetadata(
            @Parameter(description = "Language locale (ko, en, ja)", example = "ko")
            @RequestParam(defaultValue = "ko") String locale) {
        SeoMetadataResponse metadata = seoService.getHomePageMetadata(locale);
        return ResponseUtil.ok(metadata);
    }
    
    /**
     * Gets SEO metadata for project detail page.
     * 
     * @param projectId Project ID
     * @param locale Language locale (ko, en, ja), default: ko
     * @return SEO metadata
     */
    @GetMapping("/projects/{projectId}")
    @Operation(summary = "Get project SEO metadata", 
               description = "Returns SEO metadata for a specific project including structured data")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ApiResponse<SeoMetadataResponse>> getProjectMetadata(
            @Parameter(description = "Project ID", required = true)
            @PathVariable String projectId,
            @Parameter(description = "Language locale (ko, en, ja)", example = "ko")
            @RequestParam(defaultValue = "ko") String locale) {
        SeoMetadataResponse metadata = seoService.getProjectMetadata(projectId, locale);
        return ResponseUtil.ok(metadata);
    }
    
    /**
     * Gets SEO metadata for projects list page.
     * 
     * @param locale Language locale (ko, en, ja), default: ko
     * @return SEO metadata
     */
    @GetMapping("/projects")
    @Operation(summary = "Get projects page SEO metadata")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<SeoMetadataResponse>> getProjectsPageMetadata(
            @Parameter(description = "Language locale (ko, en, ja)", example = "ko")
            @RequestParam(defaultValue = "ko") String locale) {
        SeoMetadataResponse metadata = seoService.getProjectsPageMetadata(locale);
        return ResponseUtil.ok(metadata);
    }
    
    /**
     * Gets SEO metadata for academics page.
     * 
     * @param locale Language locale (ko, en, ja), default: ko
     * @return SEO metadata
     */
    @GetMapping("/academics")
    @Operation(summary = "Get academics page SEO metadata")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<SeoMetadataResponse>> getAcademicsPageMetadata(
            @Parameter(description = "Language locale (ko, en, ja)", example = "ko")
            @RequestParam(defaultValue = "ko") String locale) {
        SeoMetadataResponse metadata = seoService.getAcademicsPageMetadata(locale);
        return ResponseUtil.ok(metadata);
    }
    
    /**
     * Gets SEO metadata for about page.
     * 
     * @param locale Language locale (ko, en, ja), default: ko
     * @return SEO metadata
     */
    @GetMapping("/about")
    @Operation(summary = "Get about page SEO metadata")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<SeoMetadataResponse>> getAboutPageMetadata(
            @Parameter(description = "Language locale (ko, en, ja)", example = "ko")
            @RequestParam(defaultValue = "ko") String locale) {
        SeoMetadataResponse metadata = seoService.getAboutPageMetadata(locale);
        return ResponseUtil.ok(metadata);
    }
}

