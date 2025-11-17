package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.request.JourneyMilestoneCreateRequest;
import com.mytechfolio.portfolio.dto.request.JourneyMilestoneUpdateRequest;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.JourneyMilestoneResponse;
import com.mytechfolio.portfolio.service.JourneyMilestoneService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import com.mytechfolio.portfolio.validation.ValidMongoId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for journey milestone management.
 * Provides CRUD operations for journey milestones.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@RestController
@RequestMapping(ApiConstants.JOURNEY_MILESTONES_ENDPOINT)
@Tag(name = "Journey Milestones", description = "커리어 여정 마일스톤 관리 API")
public class JourneyMilestoneController {

    private final JourneyMilestoneService milestoneService;

    public JourneyMilestoneController(JourneyMilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @GetMapping
    @Operation(summary = "마일스톤 목록 조회", description = "연도순으로 정렬된 모든 마일스톤을 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공")
    })
    public ResponseEntity<ApiResponse<List<JourneyMilestoneResponse>>> getAllMilestones() {
        List<JourneyMilestoneResponse> response = milestoneService.getAllMilestones();
        return ResponseUtil.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "마일스톤 상세 조회", description = "마일스톤 ID로 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "마일스톤을 찾을 수 없음")
    })
    public ResponseEntity<ApiResponse<JourneyMilestoneResponse>> getMilestone(
            @Parameter(description = "마일스톤 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @ValidMongoId(message = "Invalid milestone ID format")
            String id
    ) {
        JourneyMilestoneResponse response = milestoneService.getMilestone(id);
        return ResponseUtil.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('CONTENT_MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "마일스톤 생성", description = "새로운 마일스톤을 생성합니다. 관리자 권한이 필요합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "생성됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<ApiResponse<JourneyMilestoneResponse>> createMilestone(
            @Valid @RequestBody JourneyMilestoneCreateRequest request
    ) {
        JourneyMilestoneResponse response = milestoneService.createMilestone(request);
        return ResponseUtil.created(response, "마일스톤이 성공적으로 생성되었습니다");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CONTENT_MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "마일스톤 수정", description = "기존 마일스톤을 수정합니다. 관리자 권한이 필요합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "마일스톤을 찾을 수 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<ApiResponse<JourneyMilestoneResponse>> updateMilestone(
            @Parameter(description = "마일스톤 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @ValidMongoId(message = "Invalid milestone ID format")
            String id,
            @Valid @RequestBody JourneyMilestoneUpdateRequest request
    ) {
        JourneyMilestoneResponse response = milestoneService.updateMilestone(id, request);
        return ResponseUtil.ok(response, "마일스톤이 성공적으로 수정되었습니다");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CONTENT_MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "마일스톤 삭제", description = "마일스톤을 삭제합니다. 관리자 권한이 필요합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "삭제됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 ID 형식"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "마일스톤을 찾을 수 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<ApiResponse<Void>> deleteMilestone(
            @Parameter(description = "마일스톤 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @ValidMongoId(message = "Invalid milestone ID format")
            String id
    ) {
        milestoneService.deleteMilestone(id);
        return ResponseUtil.noContent();
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "상태별 마일스톤 조회", description = "상태별로 마일스톤을 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공")
    })
    public ResponseEntity<ApiResponse<List<JourneyMilestoneResponse>>> getMilestonesByStatus(
            @Parameter(description = "마일스톤 상태 (COMPLETED, CURRENT, PLANNED)", required = true)
            @PathVariable 
            com.mytechfolio.portfolio.domain.JourneyMilestone.MilestoneStatus status
    ) {
        List<JourneyMilestoneResponse> response = milestoneService.getMilestonesByStatus(status);
        return ResponseUtil.ok(response);
    }
}

