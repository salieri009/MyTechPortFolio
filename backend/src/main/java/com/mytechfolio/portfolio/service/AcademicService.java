package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Academic;
import com.mytechfolio.portfolio.dto.request.AcademicCreateRequest;
import com.mytechfolio.portfolio.dto.request.AcademicUpdateRequest;
import com.mytechfolio.portfolio.dto.response.AcademicResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.AcademicMapper;
import com.mytechfolio.portfolio.repository.AcademicRepository;
import com.mytechfolio.portfolio.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing academic information.
 * Handles CRUD operations for academic records with pagination and filtering.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AcademicService {

    private final AcademicRepository academicRepository;
    private final AcademicMapper academicMapper;

    /**
     * Retrieves a paginated list of academic records.
     * 
     * @param page Page number (1-based)
     * @param size Page size
     * @param semester Optional semester filter
     * @return Paginated response with academic records
     */
    public PageResponse<AcademicResponse> getAcademics(int page, int size, String semester) {
        log.debug("Fetching academics - page: {}, size: {}, semester: {}", page, size, semester);
        Pageable pageable = PaginationUtil.createPageable(page, size, Sort.by("semester"));
        Page<Academic> academicPage = academicRepository.findBySemesterContaining(semester, pageable);

        return PaginationUtil.toPageResponse(academicPage, academicMapper::toResponse, page);
    }

    public AcademicResponse getAcademic(String id) {
        Academic academic = academicRepository.findByIdWithProjects(id)
                .orElseThrow(() -> new ResourceNotFoundException("Academic", id));
        return academicMapper.toResponse(academic);
    }
    
    @Transactional
    public AcademicResponse createAcademic(AcademicCreateRequest request) {
        Academic academic = academicMapper.toEntity(request);
        Academic savedAcademic = academicRepository.save(academic);
        log.info("Academic record created successfully with ID: {}", savedAcademic.getId());
        return academicMapper.toResponse(savedAcademic);
    }
    
    /**
     * Updates an existing academic record.
     * 
     * @param id Academic ID
     * @param request Academic update request
     * @return Updated academic response
     * @throws ResourceNotFoundException if academic not found
     */
    @Transactional
    public AcademicResponse updateAcademic(String id, AcademicUpdateRequest request) {
        log.info("Updating academic with ID: {}", id);
        Academic academic = academicRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Academic not found for update with ID: {}", id);
                    return new ResourceNotFoundException("Academic", id);
                });
        
        academicMapper.updateEntity(academic, request);
        
        Academic savedAcademic = academicRepository.save(academic);
        log.info("Academic updated successfully with ID: {}", savedAcademic.getId());
        return academicMapper.toResponse(savedAcademic);
    }
    
    /**
     * Deletes an academic record by ID.
     * 
     * @param id Academic ID
     * @throws ResourceNotFoundException if academic not found
     */
    @Transactional
    public void deleteAcademic(String id) {
        log.info("Deleting academic with ID: {}", id);
        if (!academicRepository.existsById(id)) {
            log.warn("Academic not found for deletion with ID: {}", id);
            throw new ResourceNotFoundException("Academic", id);
        }
        academicRepository.deleteById(id);
        log.info("Academic deleted successfully with ID: {}", id);
    }
    
    /**
     * Deletes all academic records.
     * WARNING: This is a destructive operation. Use with caution.
     */
    @Transactional
    public void deleteAllAcademics() {
        log.warn("Deleting all academics - this is a destructive operation");
        long count = academicRepository.count();
        academicRepository.deleteAll();
        log.info("Deleted {} academic records", count);
    }
    
}
