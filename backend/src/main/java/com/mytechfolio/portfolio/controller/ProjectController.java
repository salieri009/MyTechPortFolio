package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.request.ProjectCreateRequest;
import com.mytechfolio.portfolio.dto.request.ProjectUpdateRequest;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.dto.response.ProjectDetailResponse;
import com.mytechfolio.portfolio.dto.response.ProjectSummaryResponse;
import com.mytechfolio.portfolio.service.ProjectService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for project management operations.
 * Provides CRUD operations for projects with pagination, filtering, and sorting.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@RestController
@RequestMapping(ApiConstants.PROJECTS_ENDPOINT)
@Tag(name = "Projects", description = "프로젝트 관리 API")
public class ProjectController {

    private final ProjectService projectService;

    // Lombok @RequiredArgsConstructor가 작동하지 않는 경우를 대비한 수동 생성자
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "프로젝트 목록 조회", description = "페이징, 정렬, 필터링을 지원하는 프로젝트 목록을 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<ApiResponse<PageResponse<ProjectSummaryResponse>>> getProjects(
            @Parameter(description = "페이지 번호 (1부터 시작)", example = "1")
            @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_NUMBER) @Min(1) int page,
            
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_SIZE) @Min(1) @Max(ApiConstants.MAX_PAGE_SIZE) int size,
            
            @Parameter(description = "정렬 기준 (field,direction)", example = "endDate,desc")
            @RequestParam(required = false, defaultValue = ApiConstants.DEFAULT_SORT_FIELD + "," + ApiConstants.DEFAULT_SORT_DIRECTION) String sort,
            
            @Parameter(description = "기술 스택 필터 (쉼표로 구분)", example = "React,Spring Boot")
            @RequestParam(required = false) String techStacks,
            
            @Parameter(description = "연도 필터", example = "2024")
            @RequestParam(required = false) Integer year
    ) {
        PageResponse<ProjectSummaryResponse> response = projectService.getProjects(page, size, sort, techStacks, year);
        return ResponseUtil.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "프로젝트 상세 조회", description = "프로젝트 ID로 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 ID 형식"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음")
    })
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> getProject(
            @Parameter(description = "프로젝트 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @com.mytechfolio.portfolio.validation.ValidMongoId(message = "Invalid project ID format")
            String id
    ) {
        ProjectDetailResponse response = projectService.getProject(id);
        return ResponseUtil.ok(response);
    }

    @PostMapping
    @Operation(summary = "프로젝트 생성", description = "새로운 프로젝트를 생성합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "생성됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> createProject(
            @Valid @RequestBody ProjectCreateRequest request
    ) {
        ProjectDetailResponse response = projectService.createProject(request);
        return ResponseUtil.created(response, "프로젝트가 성공적으로 생성되었습니다");
    }

    @PutMapping("/{id}")
    @Operation(summary = "프로젝트 수정", description = "기존 프로젝트를 수정합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음")
    })
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> updateProject(
            @Parameter(description = "프로젝트 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @com.mytechfolio.portfolio.validation.ValidMongoId(message = "Invalid project ID format")
            String id,
            @Valid @RequestBody ProjectUpdateRequest request
    ) {
        ProjectDetailResponse response = projectService.updateProject(id, request);
        return ResponseUtil.ok(response, "프로젝트가 성공적으로 수정되었습니다");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "프로젝트 삭제", description = "프로젝트를 삭제합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "삭제됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 ID 형식"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음")
    })
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @Parameter(description = "프로젝트 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @com.mytechfolio.portfolio.validation.ValidMongoId(message = "Invalid project ID format")
            String id
    ) {
        projectService.deleteProject(id);
        return ResponseUtil.noContent();
    }
}
