package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.constants.ErrorCode;
import com.mytechfolio.portfolio.domain.Testimonial;
import com.mytechfolio.portfolio.dto.request.TestimonialCreateRequest;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.TestimonialResponse;
import com.mytechfolio.portfolio.service.TestimonialService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for testimonial management.
 * Handles CRUD operations for testimonials and recommendations.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@RestController
@RequestMapping(ApiConstants.API_BASE_PATH + "/testimonials")
@Tag(name = "Testimonials", description = "Testimonial and recommendation management API")
@RequiredArgsConstructor
public class TestimonialController {
    
    private final TestimonialService testimonialService;
    
    /**
     * Gets all active testimonials.
     * 
     * @return List of testimonials
     */
    @GetMapping
    @Operation(summary = "Get all testimonials", 
               description = "Returns all active and approved testimonials")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> getAllTestimonials() {
        List<TestimonialResponse> testimonials = testimonialService.getAllTestimonials();
        return ResponseUtil.ok(testimonials);
    }
    
    /**
     * Gets featured testimonials.
     * 
     * @return List of featured testimonials
     */
    @GetMapping("/featured")
    @Operation(summary = "Get featured testimonials", 
               description = "Returns featured testimonials for prominent display")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> getFeaturedTestimonials() {
        List<TestimonialResponse> testimonials = testimonialService.getFeaturedTestimonials();
        return ResponseUtil.ok(testimonials);
    }
    
    /**
     * Gets testimonials by type.
     * 
     * @param type Testimonial type (CLIENT, COLLEAGUE, MENTOR, PROFESSOR, OTHER)
     * @return List of testimonials
     */
    @GetMapping("/type/{type}")
    @Operation(summary = "Get testimonials by type", 
               description = "Returns testimonials filtered by type")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid type")
    })
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> getTestimonialsByType(
            @Parameter(description = "Testimonial type", required = true, example = "CLIENT")
            @PathVariable String type) {
        try {
            Testimonial.TestimonialType testimonialType = Testimonial.TestimonialType.valueOf(type.toUpperCase());
            List<TestimonialResponse> testimonials = testimonialService.getTestimonialsByType(testimonialType);
            return ResponseUtil.ok(testimonials);
        } catch (IllegalArgumentException e) {
            ApiResponse<Void> errorResponse = ApiResponse.error(ErrorCode.BAD_REQUEST, "Invalid testimonial type: " + type);
            return ResponseEntity.badRequest()
                    .body(ResponseUtil.enrichWithMetadata(errorResponse));
        }
    }
    
    /**
     * Gets testimonials by minimum rating.
     * 
     * @param minRating Minimum rating (1-5)
     * @return List of testimonials
     */
    @GetMapping("/rating/{minRating}")
    @Operation(summary = "Get testimonials by rating", 
               description = "Returns testimonials with rating greater than or equal to specified value")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid rating")
    })
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> getTestimonialsByRating(
            @Parameter(description = "Minimum rating (1-5)", required = true, example = "4")
            @PathVariable Integer minRating) {
        if (minRating < 1 || minRating > 5) {
            ApiResponse<Void> errorResponse = ApiResponse.error(ErrorCode.BAD_REQUEST, "Rating must be between 1 and 5");
            return ResponseEntity.badRequest()
                    .body(ResponseUtil.enrichWithMetadata(errorResponse));
        }
        List<TestimonialResponse> testimonials = testimonialService.getTestimonialsByRating(minRating);
        return ResponseUtil.ok(testimonials);
    }
    
    /**
     * Gets a testimonial by ID.
     * 
     * @param id Testimonial ID
     * @return Testimonial
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get testimonial by ID", 
               description = "Returns a specific testimonial by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Testimonial not found")
    })
    public ResponseEntity<ApiResponse<TestimonialResponse>> getTestimonial(
            @Parameter(description = "Testimonial ID", required = true)
            @PathVariable String id) {
        TestimonialResponse testimonial = testimonialService.getTestimonial(id);
        return ResponseUtil.ok(testimonial);
    }
    
    /**
     * Creates a new testimonial.
     * 
     * @param request Testimonial creation request
     * @return Created testimonial
     */
    @PostMapping
    @Operation(summary = "Create testimonial", 
               description = "Creates a new testimonial")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<ApiResponse<TestimonialResponse>> createTestimonial(
            @Valid @RequestBody TestimonialCreateRequest request) {
        TestimonialResponse testimonial = testimonialService.createTestimonial(request);
        return ResponseUtil.created(testimonial, "Testimonial created successfully");
    }
    
    /**
     * Updates a testimonial.
     * 
     * @param id Testimonial ID
     * @param request Update request
     * @return Updated testimonial
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update testimonial", 
               description = "Updates an existing testimonial")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Success"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Testimonial not found")
    })
    public ResponseEntity<ApiResponse<TestimonialResponse>> updateTestimonial(
            @Parameter(description = "Testimonial ID", required = true)
            @PathVariable String id,
            @Valid @RequestBody TestimonialCreateRequest request) {
        TestimonialResponse testimonial = testimonialService.updateTestimonial(id, request);
        return ResponseUtil.ok(testimonial, "Testimonial updated successfully");
    }
    
    /**
     * Deletes a testimonial.
     * 
     * @param id Testimonial ID
     * @return No content
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete testimonial", 
               description = "Deletes a testimonial")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Testimonial not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteTestimonial(
            @Parameter(description = "Testimonial ID", required = true)
            @PathVariable String id) {
        testimonialService.deleteTestimonial(id);
        return ResponseUtil.noContent();
    }
}

