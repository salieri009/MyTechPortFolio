package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.dto.request.ProjectCreateRequest;
import com.mytechfolio.portfolio.dto.request.ProjectUpdateRequest;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.dto.response.ProjectDetailResponse;
import com.mytechfolio.portfolio.dto.response.ProjectSummaryResponse;
import com.mytechfolio.portfolio.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
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
            @RequestParam(defaultValue = "1") @Min(1) int page,
            
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            
            @Parameter(description = "정렬 기준 (field,direction)", example = "endDate,desc")
            @RequestParam(required = false) String sort,
            
            @Parameter(description = "기술 스택 필터 (쉼표로 구분)", example = "React,Spring Boot")
            @RequestParam(required = false) String techStacks,
            
            @Parameter(description = "연도 필터", example = "2024")
            @RequestParam(required = false) Integer year
    ) {
        PageResponse<ProjectSummaryResponse> response = projectService.getProjects(page, size, sort, techStacks, year);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "프로젝트 상세 조회", description = "프로젝트 ID로 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음")
    })
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> getProject(
            @Parameter(description = "프로젝트 ID", required = true)
            @PathVariable String id
    ) {
        ProjectDetailResponse response = projectService.getProject(id);
        return ResponseEntity.ok(ApiResponse.success(response));
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
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "프로젝트 수정", description = "기존 프로젝트를 수정합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> updateProject(
            @Parameter(description = "프로젝트 ID", required = true)
            @PathVariable String id,
            @Valid @RequestBody ProjectUpdateRequest request
    ) {
        ProjectDetailResponse response = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "프로젝트 삭제", description = "프로젝트를 삭제합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "삭제됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음")
    })
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @Parameter(description = "프로젝트 ID", required = true)
            @PathVariable String id
    ) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
