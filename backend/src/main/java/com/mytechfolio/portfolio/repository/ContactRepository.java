package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

/**
 * Repository for contact form submissions.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {
    
    /**
     * Counts contacts from same IP within time period.
     */
    long countByIpAddressAndCreatedAtAfter(String ipAddress, LocalDateTime after);
    
    /**
     * Checks for duplicate submissions.
     */
    boolean existsByEmailAndMessageAndCreatedAtAfter(String email, String message, LocalDateTime after);
    
    /**
     * Finds contacts by status.
     */
    java.util.List<Contact> findByStatus(Contact.ContactStatus status);
    
    /**
     * Finds unread contacts.
     */
    java.util.List<Contact> findByIsReadFalseOrderByCreatedAtDesc();
    
    /**
     * Counts unread contacts.
     */
    long countByIsReadFalse();
}

