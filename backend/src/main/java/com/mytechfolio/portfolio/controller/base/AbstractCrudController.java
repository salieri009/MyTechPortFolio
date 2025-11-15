package com.mytechfolio.portfolio.controller.base;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.service.BaseService;
import com.mytechfolio.portfolio.util.ResponseUtil;
import com.mytechfolio.portfolio.validation.ValidMongoId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Abstract base controller implementation for CRUD operations.
 * Provides common REST endpoints following DRY principle.
 * 
 * @param <T> Entity type
 * @param <ID> ID type
 * @param <R> Response DTO type
 * @param <C> Create Request DTO type
 * @param <U> Update Request DTO type
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public abstract class AbstractCrudController<T, ID, R, C, U> implements BaseController<R, C, U, ID> {
    
    protected final BaseService<T, ID, R, C, U> service;
    
    protected AbstractCrudController(BaseService<T, ID, R, C, U> service) {
        this.service = service;
    }
    
    /**
     * Get resource name for Swagger documentation.
     * Override in subclasses to customize.
     */
    protected abstract String getResourceName();
    
    @GetMapping
    @Operation(summary = "목록 조회", description = "페이징과 정렬을 지원하는 목록을 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @Override
    public ResponseEntity<ApiResponse<PageResponse<R>>> findAll(
            @Parameter(description = "페이지 번호 (1부터 시작)", example = "1")
            @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_NUMBER) @Min(1) int page,
            
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "" + ApiConstants.DEFAULT_PAGE_SIZE) @Min(1) @Max(ApiConstants.MAX_PAGE_SIZE) int size,
            
            @Parameter(description = "정렬 기준 (field,direction)", example = "createdAt,desc")
            @RequestParam(required = false, defaultValue = ApiConstants.DEFAULT_SORT_FIELD + "," + ApiConstants.DEFAULT_SORT_DIRECTION) String sort
    ) {
        PageResponse<R> response = service.findAll(page, size, sort);
        return ResponseUtil.ok(response);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "상세 조회", description = "ID로 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 ID 형식"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    @Override
    public ResponseEntity<ApiResponse<R>> findById(
            @Parameter(description = "리소스 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @ValidMongoId(message = "Invalid ID format")
            ID id
    ) {
        R response = service.findById(id);
        return ResponseUtil.ok(response);
    }
    
    @PostMapping
    @Operation(summary = "생성", description = "새로운 리소스를 생성합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "생성됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @Override
    public ResponseEntity<ApiResponse<R>> create(@Valid @RequestBody C createRequest) {
        R response = service.create(createRequest);
        return ResponseUtil.created(response, getResourceName() + "가 성공적으로 생성되었습니다");
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "수정", description = "기존 리소스를 수정합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    @Override
    public ResponseEntity<ApiResponse<R>> update(
            @Parameter(description = "리소스 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @ValidMongoId(message = "Invalid ID format")
            ID id,
            @Valid @RequestBody U updateRequest
    ) {
        R response = service.update(id, updateRequest);
        return ResponseUtil.ok(response, getResourceName() + "가 성공적으로 수정되었습니다");
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "삭제", description = "리소스를 삭제합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "삭제됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 ID 형식"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    @Override
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "리소스 ID (MongoDB ObjectId)", required = true, example = "507f1f77bcf86cd799439011")
            @PathVariable 
            @ValidMongoId(message = "Invalid ID format")
            ID id
    ) {
        service.deleteById(id);
        return ResponseUtil.noContent();
    }
}

