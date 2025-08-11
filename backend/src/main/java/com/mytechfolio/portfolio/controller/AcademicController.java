package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.dto.response.AcademicResponse;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.service.AcademicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academics")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Academics", description = "학업 과정 관리 API")
public class AcademicController {

    private final AcademicService academicService;

    @GetMapping
    @Operation(summary = "학업 과정 목록 조회", description = "페이징과 학기 필터링을 지원하는 학업 과정 목록을 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<ApiResponse<PageResponse<AcademicResponse>>> getAcademics(
            @Parameter(description = "페이지 번호 (1부터 시작)", example = "1")
            @RequestParam(defaultValue = "1") @Min(1) int page,
            
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            
            @Parameter(description = "학기 필터", example = "2024-1")
            @RequestParam(defaultValue = "") String semester
    ) {
        PageResponse<AcademicResponse> response = academicService.getAcademics(page, size, semester);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "학업 과정 상세 조회", description = "학업 과정 ID로 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "학업 과정을 찾을 수 없음")
    })
    public ResponseEntity<ApiResponse<AcademicResponse>> getAcademic(
            @Parameter(description = "학업 과정 ID", required = true)
            @PathVariable Long id
    ) {
        AcademicResponse response = academicService.getAcademic(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
