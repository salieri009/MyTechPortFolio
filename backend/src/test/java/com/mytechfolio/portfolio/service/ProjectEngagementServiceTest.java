package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.ProjectEngagement;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.repository.ProjectEngagementRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectEngagementServiceTest {

    @Mock
    private ProjectEngagementRepository engagementRepository;

    @InjectMocks
    private ProjectEngagementService engagementService;

    @Test
    void updateEngagementRejectsWrongSecret() {
        ProjectEngagement e = ProjectEngagement.builder()
                .id("e1")
                .updateSecret("good-secret")
                .build();
        when(engagementRepository.findById("e1")).thenReturn(Optional.of(e));

        assertThatThrownBy(() -> engagementService.updateEngagement(
                "e1", "bad", 1L, null, null, null))
                .isInstanceOf(AccessDeniedException.class);
        verify(engagementRepository, never()).save(any());
    }

    @Test
    void updateEngagementRejectsMissingSecretOnEntity() {
        ProjectEngagement e = ProjectEngagement.builder().id("e1").updateSecret(null).build();
        when(engagementRepository.findById("e1")).thenReturn(Optional.of(e));

        assertThatThrownBy(() -> engagementService.updateEngagement(
                "e1", "any", 1L, null, null, null))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void updateEngagementNotFound() {
        when(engagementRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> engagementService.updateEngagement(
                "missing", "s", 1L, null, null, null))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
