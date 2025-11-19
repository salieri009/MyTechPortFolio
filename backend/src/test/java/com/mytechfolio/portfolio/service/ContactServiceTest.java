package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Contact;
import com.mytechfolio.portfolio.dto.request.ContactRequest;
import com.mytechfolio.portfolio.repository.ContactRepository;
import com.mytechfolio.portfolio.util.InputSanitizer;
import com.mytechfolio.portfolio.validation.ValidationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;
    
    @Mock
    private InputSanitizer inputSanitizer;
    
    @Mock
    private ValidationService validationService;
    
    @Mock
    private EmailService emailService;
    
    @InjectMocks
    private ContactService contactService;

    @Test
    void shouldSubmitContactWhenValidRequest() {
        // Given
        ContactRequest request = new ContactRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setMessage("Test message");
        request.setWebsite(""); // Empty honeypot
        
        Contact savedContact = Contact.builder()
            .id("contact-123")
            .email("john@example.com")
            .name("John Doe")
            .build();
        
        when(inputSanitizer.sanitizeText(anyString())).thenAnswer(i -> i.getArgument(0));
        when(contactRepository.save(any())).thenReturn(savedContact);
        doNothing().when(validationService).validateContactSubmission(any(), any(), any(), any());
        
        // When
        Contact result = contactService.submitContact(request, "127.0.0.1", "Mozilla/5.0");
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john@example.com");
        verify(contactRepository).save(any(Contact.class));
        verify(emailService).sendContactNotification(any(), any(), any(), any(), any());
    }

    @Test
    void shouldCreateSpamContactWhenHoneypotFilled() {
        // Given
        ContactRequest request = new ContactRequest();
        request.setName("Spam Bot");
        request.setEmail("spam@example.com");
        request.setMessage("Spam message");
        request.setWebsite("http://spam.com"); // Honeypot filled
        
        Contact spamContact = Contact.builder()
            .id("spam-123")
            .isSpam(true)
            .status(Contact.ContactStatus.SPAM)
            .build();
        
        when(inputSanitizer.sanitizeText(anyString())).thenAnswer(i -> i.getArgument(0));
        when(contactRepository.save(any())).thenReturn(spamContact);
        doThrow(new IllegalArgumentException("Invalid submission detected"))
            .when(validationService).validateContactSubmission(any(), any(), any(), any());
        
        // When
        Contact result = contactService.submitContact(request, "127.0.0.1", "Bot");
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getIsSpam()).isTrue();
        verify(contactRepository).save(any(Contact.class));
    }

    @Test
    void shouldSaveContactEvenWhenEmailFails() {
        // Given
        ContactRequest request = new ContactRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setMessage("Test message");
        request.setWebsite("");
        
        Contact savedContact = Contact.builder()
            .id("contact-123")
            .email("john@example.com")
            .build();
        
        when(inputSanitizer.sanitizeText(anyString())).thenAnswer(i -> i.getArgument(0));
        when(contactRepository.save(any())).thenReturn(savedContact);
        doNothing().when(validationService).validateContactSubmission(any(), any(), any(), any());
        doThrow(new RuntimeException("Email service unavailable"))
            .when(emailService).sendContactNotification(any(), any(), any(), any(), any());
        
        // When
        Contact result = contactService.submitContact(request, "127.0.0.1", "Mozilla/5.0");
        
        // Then
        assertThat(result).isNotNull();
        verify(contactRepository).save(any(Contact.class));
    }
}

