package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.dto.request.ProjectCreateRequest;
import com.mytechfolio.portfolio.dto.request.ProjectUpdateRequest;
import com.mytechfolio.portfolio.dto.request.AcademicCreateRequest;
import com.mytechfolio.portfolio.dto.request.AcademicUpdateRequest;
import com.mytechfolio.portfolio.dto.request.TechStackCreateRequest;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.service.ProjectService;
import com.mytechfolio.portfolio.service.AcademicService;
import com.mytechfolio.portfolio.service.TechStackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Tag(name = "Admin", description = "관리자 API")
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://localhost:5177"})
public class AdminController {

    private final ProjectService projectService;
    private final AcademicService academicService;
    private final TechStackService techStackService;

    // Lombok @RequiredArgsConstructor가 작동하지 않는 경우를 대비한 수동 생성자
    public AdminController(ProjectService projectService, AcademicService academicService, TechStackService techStackService) {
        this.projectService = projectService;
        this.academicService = academicService;
        this.techStackService = techStackService;
    }

    // 프로젝트 관리
    @Operation(summary = "프로젝트 생성", description = "새로운 프로젝트를 생성합니다.")
    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<?>> createProject(@Valid @RequestBody ProjectCreateRequest request) {
        var project = projectService.createProject(request);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @Operation(summary = "프로젝트 수정", description = "기존 프로젝트를 수정합니다.")
    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<?>> updateProject(
            @PathVariable Long id, 
            @Valid @RequestBody ProjectUpdateRequest request) {
        var project = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @Operation(summary = "프로젝트 삭제", description = "프로젝트를 삭제합니다.")
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<?>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("프로젝트가 삭제되었습니다."));
    }

    // 학업 관리
    @Operation(summary = "학업 정보 생성", description = "새로운 학업 정보를 생성합니다.")
    @PostMapping("/academics")
    public ResponseEntity<ApiResponse<?>> createAcademic(@Valid @RequestBody AcademicCreateRequest request) {
        var academic = academicService.createAcademic(request);
        return ResponseEntity.ok(ApiResponse.success(academic));
    }

    @Operation(summary = "학업 정보 수정", description = "기존 학업 정보를 수정합니다.")
    @PutMapping("/academics/{id}")
    public ResponseEntity<ApiResponse<?>> updateAcademic(
            @PathVariable Long id, 
            @Valid @RequestBody AcademicUpdateRequest request) {
        var academic = academicService.updateAcademic(id, request);
        return ResponseEntity.ok(ApiResponse.success(academic));
    }

    @Operation(summary = "학업 정보 삭제", description = "학업 정보를 삭제합니다.")
    @DeleteMapping("/academics/{id}")
    public ResponseEntity<ApiResponse<?>> deleteAcademic(@PathVariable Long id) {
        academicService.deleteAcademic(id);
        return ResponseEntity.ok(ApiResponse.success("학업 정보가 삭제되었습니다."));
    }

    // 기술 스택 관리
    @Operation(summary = "기술 스택 생성", description = "새로운 기술 스택을 생성합니다.")
    @PostMapping("/tech-stacks")
    public ResponseEntity<ApiResponse<?>> createTechStack(@Valid @RequestBody TechStackCreateRequest request) {
        var techStack = techStackService.createTechStack(request);
        return ResponseEntity.ok(ApiResponse.success(techStack));
    }

    @Operation(summary = "기술 스택 삭제", description = "기술 스택을 삭제합니다.")
    @DeleteMapping("/tech-stacks/{id}")
    public ResponseEntity<ApiResponse<?>> deleteTechStack(@PathVariable Long id) {
        techStackService.deleteTechStack(id);
        return ResponseEntity.ok(ApiResponse.success("기술 스택이 삭제되었습니다."));
    }

    // 데이터 초기화
    @Operation(summary = "데이터 초기화", description = "모든 데이터를 초기화하고 샘플 데이터를 다시 생성합니다.")
    @PostMapping("/reset-data")
    public ResponseEntity<ApiResponse<?>> resetData() {
        // 모든 데이터 삭제 후 초기 데이터 재생성
        projectService.deleteAllProjects();
        academicService.deleteAllAcademics();
        techStackService.deleteAllTechStacks();
        
        // 초기 데이터 재생성 로직은 DataInitializer에서 처리
        return ResponseEntity.ok(ApiResponse.success("데이터가 초기화되었습니다."));
    }
}
