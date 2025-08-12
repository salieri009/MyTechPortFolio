package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.TechStack;
import com.mytechfolio.portfolio.dto.request.TechStackCreateRequest;
import com.mytechfolio.portfolio.dto.response.TechStackResponse;
import com.mytechfolio.portfolio.repository.TechStackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TechStackService {

    private final TechStackRepository techStackRepository;

    public List<TechStackResponse> getTechStacks(String type) {
        List<TechStack> techStacks;
        
        if (type != null && !type.isEmpty()) {
            try {
                TechStack.TechType techType = TechStack.TechType.valueOf(type);
                techStacks = techStackRepository.findByType(techType);
            } catch (IllegalArgumentException e) {
                techStacks = List.of();
            }
        } else {
            techStacks = techStackRepository.findAll();
        }

        return techStacks.stream()
                .map(TechStackResponse::from)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TechStackResponse createTechStack(TechStackCreateRequest request) {
        // Check if tech stack already exists
        if (techStackRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("TechStack already exists with name: " + request.getName());
        }
        
        TechStack techStack = TechStack.builder()
                .name(request.getName())
                .type(TechStack.TechType.valueOf(request.getType().toUpperCase()))
                .logoUrl(request.getLogoUrl())
                .build();
        
        TechStack savedTechStack = techStackRepository.save(techStack);
        return TechStackResponse.from(savedTechStack);
    }
    
    @Transactional
    public void deleteTechStack(String id) {
        if (!techStackRepository.existsById(id)) {
            throw new RuntimeException("TechStack not found with id: " + id);
        }
        techStackRepository.deleteById(id);
    }
    
    @Transactional
    public void deleteAllTechStacks() {
        techStackRepository.deleteAll();
    }
}
