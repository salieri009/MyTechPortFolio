package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.JourneyMilestone;
import com.mytechfolio.portfolio.dto.request.JourneyMilestoneCreateRequest;
import com.mytechfolio.portfolio.dto.request.JourneyMilestoneUpdateRequest;
import com.mytechfolio.portfolio.dto.response.JourneyMilestoneResponse;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.JourneyMilestoneMapper;
import com.mytechfolio.portfolio.repository.JourneyMilestoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing journey milestones.
 * Handles CRUD operations for journey milestones.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JourneyMilestoneService {

    private final JourneyMilestoneRepository milestoneRepository;
    private final JourneyMilestoneMapper milestoneMapper;

    /**
     * Retrieves all milestones ordered by year ascending.
     * 
     * @return List of milestone responses
     */
    public List<JourneyMilestoneResponse> getAllMilestones() {
        log.debug("Fetching all journey milestones");
        List<JourneyMilestone> milestones = milestoneRepository.findAllByOrderByYearAsc();
        return milestones.stream()
                .map(milestoneMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a milestone by ID.
     * 
     * @param id Milestone ID
     * @return Milestone response
     * @throws ResourceNotFoundException if milestone not found
     */
    public JourneyMilestoneResponse getMilestone(String id) {
        log.debug("Fetching milestone with ID: {}", id);
        JourneyMilestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JourneyMilestone", id));
        return milestoneMapper.toResponse(milestone);
    }

    /**
     * Creates a new milestone.
     * 
     * @param request Create request
     * @return Created milestone response
     */
    @Transactional
    public JourneyMilestoneResponse createMilestone(JourneyMilestoneCreateRequest request) {
        log.info("Creating new journey milestone: {}", request.getTitle());
        JourneyMilestone milestone = milestoneMapper.toEntity(request);
        JourneyMilestone savedMilestone = milestoneRepository.save(milestone);
        log.info("Journey milestone created successfully with ID: {}", savedMilestone.getId());
        return milestoneMapper.toResponse(savedMilestone);
    }

    /**
     * Updates an existing milestone.
     * 
     * @param id Milestone ID
     * @param request Update request
     * @return Updated milestone response
     * @throws ResourceNotFoundException if milestone not found
     */
    @Transactional
    public JourneyMilestoneResponse updateMilestone(String id, JourneyMilestoneUpdateRequest request) {
        log.info("Updating journey milestone with ID: {}", id);
        JourneyMilestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Journey milestone not found for update with ID: {}", id);
                    return new ResourceNotFoundException("JourneyMilestone", id);
                });

        milestoneMapper.updateEntity(milestone, request);
        JourneyMilestone savedMilestone = milestoneRepository.save(milestone);
        log.info("Journey milestone updated successfully with ID: {}", savedMilestone.getId());
        return milestoneMapper.toResponse(savedMilestone);
    }

    /**
     * Deletes a milestone by ID.
     * 
     * @param id Milestone ID
     * @throws ResourceNotFoundException if milestone not found
     */
    @Transactional
    public void deleteMilestone(String id) {
        log.info("Deleting journey milestone with ID: {}", id);
        if (!milestoneRepository.existsById(id)) {
            log.warn("Journey milestone not found for deletion with ID: {}", id);
            throw new ResourceNotFoundException("JourneyMilestone", id);
        }
        milestoneRepository.deleteById(id);
        log.info("Journey milestone deleted successfully with ID: {}", id);
    }

    /**
     * Retrieves milestones by status.
     * 
     * @param status Milestone status
     * @return List of milestone responses
     */
    public List<JourneyMilestoneResponse> getMilestonesByStatus(JourneyMilestone.MilestoneStatus status) {
        log.debug("Fetching milestones with status: {}", status);
        List<JourneyMilestone> milestones = milestoneRepository.findByStatus(status);
        return milestones.stream()
                .map(milestoneMapper::toResponse)
                .collect(Collectors.toList());
    }
}

