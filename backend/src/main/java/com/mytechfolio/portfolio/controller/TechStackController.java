package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.TechStackResponse;
import com.mytechfolio.portfolio.service.TechStackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/techstacks")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "TechStacks", description = "기술 스택 관리 API")
public class TechStackController {

    private final TechStackService techStackService;

    @GetMapping
    @Operation(summary = "기술 스택 목록 조회", description = "타입 필터링을 지원하는 기술 스택 목록을 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<ApiResponse<List<TechStackResponse>>> getTechStacks(
            @Parameter(description = "기술 스택 타입 필터", example = "FRONTEND")
            @RequestParam(required = false) String type
    ) {
        List<TechStackResponse> response = techStackService.getTechStacks(type);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
