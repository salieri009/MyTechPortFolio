package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.request.ContactRequest;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.service.ContactService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for contact form submissions.
 * Handles lead generation and recruiter inquiries.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@RestController
@RequestMapping(ApiConstants.API_BASE_PATH + "/contact")
@Tag(name = "Contact", description = "Contact form and lead generation API")
@RequiredArgsConstructor
public class ContactController {
    
    private final ContactService contactService;
    
    /**
     * Submits a contact form.
     * Includes spam protection and rate limiting.
     * 
     * @param request Contact form data
     * @param httpRequest HTTP request for IP and user agent
     * @return Success response
     */
    @PostMapping
    @Operation(summary = "Submit contact form", description = "Submits a contact form with spam protection")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Contact submitted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request or rate limit exceeded"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "429", description = "Too many requests")
    })
    public ResponseEntity<ApiResponse<Void>> submitContact(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest) {
        
        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        
        contactService.submitContact(request, ipAddress, userAgent);
        
        return ResponseUtil.created(null, "Thank you for your message. I'll get back to you soon!");
    }
    
    /**
     * Extracts client IP address from request.
     * Handles proxy headers (X-Forwarded-For, etc.).
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // Handle comma-separated IPs (from proxies)
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }
}

