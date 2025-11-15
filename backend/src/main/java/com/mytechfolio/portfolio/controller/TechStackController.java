package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.TechStackResponse;
import com.mytechfolio.portfolio.service.TechStackService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for technology stack management.
 * Provides operations for retrieving and managing tech stacks.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@RestController
@RequestMapping(ApiConstants.TECH_STACKS_ENDPOINT)
@Tag(name = "TechStacks", description = "기술 스택 관리 API")
public class TechStackController {

    private final TechStackService techStackService;

    // Lombok @RequiredArgsConstructor가 작동하지 않는 경우를 대비한 수동 생성자
    public TechStackController(TechStackService techStackService) {
        this.techStackService = techStackService;
    }

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
        return ResponseUtil.ok(response);
    }
}
