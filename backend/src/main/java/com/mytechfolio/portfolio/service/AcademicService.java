package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Academic;
import com.mytechfolio.portfolio.dto.request.AcademicCreateRequest;
import com.mytechfolio.portfolio.dto.request.AcademicUpdateRequest;
import com.mytechfolio.portfolio.dto.response.AcademicResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.repository.AcademicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AcademicService {

    private final AcademicRepository academicRepository;

    public PageResponse<AcademicResponse> getAcademics(int page, int size, String semester) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("semester"));
        Page<Academic> academicPage = academicRepository.findBySemesterContaining(semester, pageable);

        List<AcademicResponse> academics = academicPage.getContent().stream()
                .map(AcademicResponse::from)
                .collect(Collectors.toList());

        return PageResponse.<AcademicResponse>builder()
                .page(page)
                .size(size)
                .total(academicPage.getTotalElements())
                .items(academics)
                .build();
    }

    public AcademicResponse getAcademic(Long id) {
        Academic academic = academicRepository.findByIdWithProjects(id)
                .orElseThrow(() -> new RuntimeException("Academic not found with id: " + id));
        return AcademicResponse.from(academic);
    }
    
    @Transactional
    public AcademicResponse createAcademic(AcademicCreateRequest request) {
        Academic academic = Academic.builder()
                .name(request.getName())
                .semester(request.getSemester())
                .grade(request.getGrade())
                .description(request.getDescription())
                .build();
        
        Academic savedAcademic = academicRepository.save(academic);
        return AcademicResponse.from(savedAcademic);
    }
    
    @Transactional
    public AcademicResponse updateAcademic(Long id, AcademicUpdateRequest request) {
        Academic academic = academicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic not found with id: " + id));
        
        academic.updateAcademic(request.getName(), request.getSemester(), 
                               request.getGrade(), request.getDescription());
        
        return AcademicResponse.from(academic);
    }
    
    @Transactional
    public void deleteAcademic(Long id) {
        if (!academicRepository.existsById(id)) {
            throw new RuntimeException("Academic not found with id: " + id);
        }
        academicRepository.deleteById(id);
    }
    
    @Transactional
    public void deleteAllAcademics() {
        academicRepository.deleteAll();
    }
}
