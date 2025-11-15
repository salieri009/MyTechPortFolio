package com.mytechfolio.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * Email notification service.
 * Handles sending emails for contact form submissions, resume downloads, and portfolio events.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${app.email.from:noreply@salieri009.studio}")
    private String fromEmail;
    
    @Value("${app.email.owner:owner@salieri009.studio}")
    private String ownerEmail;
    
    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;
    
    /**
     * Sends email notification to portfolio owner when contact form is submitted.
     * 
     * @param contactName Contact name
     * @param contactEmail Contact email
     * @param message Contact message
     * @param company Company name (optional)
     * @param jobTitle Job title (optional)
     */
    @Async
    public void sendContactNotification(String contactName, String contactEmail, String message, 
                                       String company, String jobTitle) {
        if (!emailEnabled) {
            log.debug("Email notifications disabled, skipping contact notification");
            return;
        }
        
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(ownerEmail);
            helper.setSubject("New Contact Form Submission - " + contactName);
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("<h2>New Contact Form Submission</h2>");
            emailBody.append("<p><strong>Name:</strong> ").append(contactName).append("</p>");
            emailBody.append("<p><strong>Email:</strong> ").append(contactEmail).append("</p>");
            if (company != null && !company.isEmpty()) {
                emailBody.append("<p><strong>Company:</strong> ").append(company).append("</p>");
            }
            if (jobTitle != null && !jobTitle.isEmpty()) {
                emailBody.append("<p><strong>Job Title:</strong> ").append(jobTitle).append("</p>");
            }
            emailBody.append("<p><strong>Message:</strong></p>");
            emailBody.append("<p>").append(message.replace("\n", "<br>")).append("</p>");
            emailBody.append("<hr>");
            emailBody.append("<p><small>This is an automated notification from your portfolio website.</small></p>");
            
            helper.setText(emailBody.toString(), true);
            
            mailSender.send(mimeMessage);
            log.info("Contact notification email sent to owner for: {}", contactEmail);
        } catch (MailException | MessagingException e) {
            log.error("Failed to send contact notification email: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Sends auto-responder email to contact form submitter.
     * 
     * @param contactEmail Contact email
     * @param contactName Contact name
     */
    @Async
    public void sendContactAutoResponder(String contactEmail, String contactName) {
        if (!emailEnabled) {
            log.debug("Email notifications disabled, skipping auto-responder");
            return;
        }
        
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(contactEmail);
            helper.setSubject("Thank you for contacting me - salieri009");
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("<h2>Thank you for reaching out!</h2>");
            emailBody.append("<p>Hi ").append(contactName).append(",</p>");
            emailBody.append("<p>Thank you for contacting me through my portfolio website. ");
            emailBody.append("I have received your message and will get back to you as soon as possible.</p>");
            emailBody.append("<p>In the meantime, feel free to check out my projects and GitHub profile.</p>");
            emailBody.append("<hr>");
            emailBody.append("<p><small>Best regards,<br>salieri009</small></p>");
            
            helper.setText(emailBody.toString(), true);
            
            mailSender.send(mimeMessage);
            log.info("Auto-responder email sent to: {}", contactEmail);
        } catch (MailException | MessagingException e) {
            log.error("Failed to send auto-responder email: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Sends email notification when resume is downloaded.
     * 
     * @param resumeVersion Resume version
     * @param downloaderEmail Downloader email (if available)
     * @param downloaderIp Downloader IP address
     */
    @Async
    public void sendResumeDownloadNotification(String resumeVersion, String downloaderEmail, String downloaderIp) {
        if (!emailEnabled) {
            log.debug("Email notifications disabled, skipping resume download notification");
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(ownerEmail);
            message.setSubject("Resume Downloaded - " + resumeVersion);
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Resume download notification:\n\n");
            emailBody.append("Version: ").append(resumeVersion).append("\n");
            if (downloaderEmail != null && !downloaderEmail.isEmpty()) {
                emailBody.append("Downloader Email: ").append(downloaderEmail).append("\n");
            }
            emailBody.append("IP Address: ").append(downloaderIp).append("\n");
            emailBody.append("Time: ").append(java.time.LocalDateTime.now()).append("\n");
            
            message.setText(emailBody.toString());
            
            mailSender.send(message);
            log.info("Resume download notification sent for version: {}", resumeVersion);
        } catch (MailException e) {
            log.error("Failed to send resume download notification: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Sends email notification for portfolio view milestones.
     * 
     * @param milestone Milestone description (e.g., "1000 views")
     * @param viewCount Current view count
     */
    @Async
    public void sendPortfolioViewMilestone(String milestone, long viewCount) {
        if (!emailEnabled) {
            log.debug("Email notifications disabled, skipping milestone notification");
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(ownerEmail);
            message.setSubject("Portfolio Milestone Reached - " + milestone);
            
            String emailBody = String.format(
                "Congratulations! Your portfolio has reached a milestone:\n\n" +
                "Milestone: %s\n" +
                "Total Views: %d\n" +
                "Time: %s\n",
                milestone, viewCount, java.time.LocalDateTime.now()
            );
            
            message.setText(emailBody);
            
            mailSender.send(message);
            log.info("Portfolio milestone notification sent: {}", milestone);
        } catch (MailException e) {
            log.error("Failed to send milestone notification: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Sends daily/weekly analytics summary email.
     * 
     * @param summary Analytics summary data
     */
    @Async
    public void sendAnalyticsSummary(String summary) {
        if (!emailEnabled) {
            log.debug("Email notifications disabled, skipping analytics summary");
            return;
        }
        
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(ownerEmail);
            helper.setSubject("Portfolio Analytics Summary");
            
            helper.setText(summary, true);
            
            mailSender.send(mimeMessage);
            log.info("Analytics summary email sent");
        } catch (MailException | MessagingException e) {
            log.error("Failed to send analytics summary: {}", e.getMessage(), e);
        }
    }
}

