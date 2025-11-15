package com.mytechfolio.portfolio.mapper;

import com.mytechfolio.portfolio.domain.Contact;
import com.mytechfolio.portfolio.dto.request.ContactRequest;
import org.springframework.stereotype.Component;

/**
 * Mapper for Contact entity conversions.
 * Handles Contact <-> DTO conversions following DRY principle.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Component
public class ContactMapper extends EntityMapper<Contact, Contact, ContactRequest, ContactRequest> {
    
    @Override
    public Contact toResponse(Contact contact) {
        // For contact, we return the entity directly as there's no separate response DTO
        return contact;
    }
    
    @Override
    public Contact toEntity(ContactRequest createRequest) {
        if (createRequest == null) {
            return null;
        }
        
        return Contact.builder()
            .email(createRequest.getEmail())
            .name(createRequest.getName())
            .company(createRequest.getCompany())
            .subject(createRequest.getSubject())
            .message(createRequest.getMessage())
            .phoneNumber(createRequest.getPhoneNumber())
            .linkedInUrl(createRequest.getLinkedInUrl())
            .jobTitle(createRequest.getJobTitle())
            .referrer(createRequest.getReferrer())
            .source(createRequest.getSource())
            .projectId(createRequest.getProjectId())
            .status(Contact.ContactStatus.NEW)
            .isSpam(false)
            .isRead(false)
            .isReplied(false)
            .build();
    }
    
    @Override
    public void updateEntity(Contact entity, ContactRequest updateRequest) {
        // Contact entities are typically not updated after creation
        // This method is provided for interface compliance
        if (entity == null || updateRequest == null) {
            return;
        }
        
        entity.setName(updateRequest.getName());
        entity.setCompany(updateRequest.getCompany());
        entity.setSubject(updateRequest.getSubject());
        entity.setMessage(updateRequest.getMessage());
        entity.setPhoneNumber(updateRequest.getPhoneNumber());
        entity.setLinkedInUrl(updateRequest.getLinkedInUrl());
        entity.setJobTitle(updateRequest.getJobTitle());
    }
}

