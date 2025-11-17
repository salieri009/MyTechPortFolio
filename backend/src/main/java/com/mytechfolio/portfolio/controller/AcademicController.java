package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.request.AcademicCreateRequest;
import com.mytechfolio.portfolio.dto.request.AcademicUpdateRequest;
import com.mytechfolio.portfolio.dto.response.AcademicResponse;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.service.AcademicService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import com.mytechfolio.portfolio.validation.ValidMongoId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for academic information management.
 * Provides CRUD operations for academic records with pagination and filtering.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@RestController
@RequestMapping(ApiConstants.ACADEMICS_ENDPOINT)
@Tag(name = "Academics", description = "학업 과정 관리 API")
public class AcademicController {

    private final AcademicService academicService;

    // Lombok @RequiredArgsConstructor가 작동하지 않는 경우를 대비한 수동 생성자
    public AcademicController(AcademicService academicService) {
        this.academicService = academicService;
    }

    @GetMapping
    @Operation(summary = "학업 과정 목록 조회", description = "페이징과 학기 필터링을 지원하는 학업 과정 목록을 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<ApiResponse<PageResponse<AcademicResponse>>> getAcademics(
            @Parameter(description = "페이지 번호 (1부터 시작)", example = "1")
            @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_NUMBER) @Min(1) int page,
            
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_SIZE) @Min(1) @Max(ApiConstants.MAX_PAGE_SIZE) int size,
            
            @Parameter(description = "학기 필터", example = "2024-1")
            @RequestParam(defaultValue = "") String semester
    ) {
        PageResponse<AcademicResponse> response = academicService.getAcademics(page, size, semester);
        return ResponseUtil.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "학업 과정 상세 조회", description = "학업 과정 ID로 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "학업 과정을 찾을 수 없음")
    })
    public ResponseEntity<ApiResponse<AcademicResponse>> getAcademic(
            @Parameter(description = "학업 과정 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @ValidMongoId(message = "Invalid academic ID format")
            String id
    ) {
        AcademicResponse response = academicService.getAcademic(id);
        return ResponseUtil.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('CONTENT_MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "학업 과정 생성", description = "새로운 학업 과정을 생성합니다. 관리자 권한이 필요합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "생성됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<ApiResponse<AcademicResponse>> createAcademic(
            @Valid @RequestBody AcademicCreateRequest request
    ) {
        AcademicResponse response = academicService.createAcademic(request);
        return ResponseUtil.created(response, "학업 과정이 성공적으로 생성되었습니다");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CONTENT_MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "학업 과정 수정", description = "기존 학업 과정을 수정합니다. 관리자 권한이 필요합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "학업 과정을 찾을 수 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<ApiResponse<AcademicResponse>> updateAcademic(
            @Parameter(description = "학업 과정 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @ValidMongoId(message = "Invalid academic ID format")
            String id,
            @Valid @RequestBody AcademicUpdateRequest request
    ) {
        AcademicResponse response = academicService.updateAcademic(id, request);
        return ResponseUtil.ok(response, "학업 과정이 성공적으로 수정되었습니다");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CONTENT_MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "학업 과정 삭제", description = "학업 과정을 삭제합니다. 관리자 권한이 필요합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "삭제됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 ID 형식"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "학업 과정을 찾을 수 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<ApiResponse<Void>> deleteAcademic(
            @Parameter(description = "학업 과정 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @ValidMongoId(message = "Invalid academic ID format")
            String id
    ) {
        academicService.deleteAcademic(id);
        return ResponseUtil.noContent();
    }
}
