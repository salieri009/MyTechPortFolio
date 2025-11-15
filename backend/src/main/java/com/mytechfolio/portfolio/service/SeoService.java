package com.mytechfolio.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mytechfolio.portfolio.dto.response.ProjectDetailResponse;
import com.mytechfolio.portfolio.dto.response.SeoMetadataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * SEO metadata generation service.
 * Generates dynamic meta tags, Open Graph, Twitter Cards, and structured data.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SeoService {
    
    private final ProjectService projectService;
    private final ObjectMapper objectMapper;
    
    @Value("${app.base-url:https://salieri009.studio}")
    private String baseUrl;
    
    @Value("${app.site-name:salieri009 Portfolio}")
    private String siteName;
    
    @Value("${app.author:salieri009}")
    private String author;
    
    /**
     * Gets SEO metadata for home page.
     * 
     * @param locale Language locale (ko, en, ja)
     * @return SEO metadata
     */
    public SeoMetadataResponse getHomePageMetadata(String locale) {
        return SeoMetadataResponse.builder()
                .title(getLocalizedTitle("home", locale))
                .description(getLocalizedDescription("home", locale))
                .keywords("salieri009, portfolio, full stack developer, React, Spring Boot, TypeScript, Java, MongoDB")
                .author(author)
                .canonicalUrl(baseUrl)
                .openGraph(SeoMetadataResponse.OpenGraph.builder()
                        .type("website")
                        .url(baseUrl)
                        .title(getLocalizedTitle("home", locale))
                        .description(getLocalizedDescription("home", locale))
                        .image(baseUrl + "/images/og-image.png")
                        .siteName(siteName)
                        .locale(locale)
                        .build())
                .twitterCard(SeoMetadataResponse.TwitterCard.builder()
                        .card("summary_large_image")
                        .url(baseUrl)
                        .title(getLocalizedTitle("home", locale))
                        .description(getLocalizedDescription("home", locale))
                        .image(baseUrl + "/images/og-image.png")
                        .creator("@salieri009")
                        .build())
                .structuredData(generateHomePageStructuredData(locale))
                .robots("index, follow")
                .build();
    }
    
    /**
     * Gets SEO metadata for project detail page.
     * 
     * @param projectId Project ID
     * @param locale Language locale
     * @return SEO metadata
     */
    public SeoMetadataResponse getProjectMetadata(String projectId, String locale) {
        ProjectDetailResponse project = projectService.getProject(projectId);
        
        String projectUrl = baseUrl + "/projects/" + projectId;
        String projectImage = project.getDemoUrl() != null 
                ? project.getDemoUrl() 
                : (baseUrl + "/images/projects/" + projectId + ".png");
        
        return SeoMetadataResponse.builder()
                .title(project.getTitle() + " | " + siteName)
                .description(project.getSummary())
                .keywords(generateKeywords(project))
                .author(author)
                .canonicalUrl(projectUrl)
                .openGraph(SeoMetadataResponse.OpenGraph.builder()
                        .type("article")
                        .url(projectUrl)
                        .title(project.getTitle())
                        .description(project.getSummary())
                        .image(projectImage)
                        .siteName(siteName)
                        .locale(locale)
                        .build())
                .twitterCard(SeoMetadataResponse.TwitterCard.builder()
                        .card("summary_large_image")
                        .url(projectUrl)
                        .title(project.getTitle())
                        .description(project.getSummary())
                        .image(projectImage)
                        .creator("@salieri009")
                        .build())
                .structuredData(generateProjectStructuredData(project))
                .robots("index, follow")
                .build();
    }
    
    /**
     * Gets SEO metadata for projects list page.
     * 
     * @param locale Language locale
     * @return SEO metadata
     */
    public SeoMetadataResponse getProjectsPageMetadata(String locale) {
        return SeoMetadataResponse.builder()
                .title(getLocalizedTitle("projects", locale) + " | " + siteName)
                .description(getLocalizedDescription("projects", locale))
                .keywords("projects, portfolio, software development, web development")
                .author(author)
                .canonicalUrl(baseUrl + "/projects")
                .openGraph(SeoMetadataResponse.OpenGraph.builder()
                        .type("website")
                        .url(baseUrl + "/projects")
                        .title(getLocalizedTitle("projects", locale))
                        .description(getLocalizedDescription("projects", locale))
                        .image(baseUrl + "/images/og-image.png")
                        .siteName(siteName)
                        .locale(locale)
                        .build())
                .twitterCard(SeoMetadataResponse.TwitterCard.builder()
                        .card("summary_large_image")
                        .url(baseUrl + "/projects")
                        .title(getLocalizedTitle("projects", locale))
                        .description(getLocalizedDescription("projects", locale))
                        .image(baseUrl + "/images/og-image.png")
                        .creator("@salieri009")
                        .build())
                .robots("index, follow")
                .build();
    }
    
    /**
     * Gets SEO metadata for academics page.
     * 
     * @param locale Language locale
     * @return SEO metadata
     */
    public SeoMetadataResponse getAcademicsPageMetadata(String locale) {
        return SeoMetadataResponse.builder()
                .title(getLocalizedTitle("academics", locale) + " | " + siteName)
                .description(getLocalizedDescription("academics", locale))
                .keywords("education, academics, university, UTS, computer science")
                .author(author)
                .canonicalUrl(baseUrl + "/academics")
                .openGraph(SeoMetadataResponse.OpenGraph.builder()
                        .type("website")
                        .url(baseUrl + "/academics")
                        .title(getLocalizedTitle("academics", locale))
                        .description(getLocalizedDescription("academics", locale))
                        .image(baseUrl + "/images/og-image.png")
                        .siteName(siteName)
                        .locale(locale)
                        .build())
                .twitterCard(SeoMetadataResponse.TwitterCard.builder()
                        .card("summary")
                        .url(baseUrl + "/academics")
                        .title(getLocalizedTitle("academics", locale))
                        .description(getLocalizedDescription("academics", locale))
                        .image(baseUrl + "/images/og-image.png")
                        .creator("@salieri009")
                        .build())
                .robots("index, follow")
                .build();
    }
    
    /**
     * Gets SEO metadata for about page.
     * 
     * @param locale Language locale
     * @return SEO metadata
     */
    public SeoMetadataResponse getAboutPageMetadata(String locale) {
        return SeoMetadataResponse.builder()
                .title(getLocalizedTitle("about", locale) + " | " + siteName)
                .description(getLocalizedDescription("about", locale))
                .keywords("about, developer, software engineer, full stack")
                .author(author)
                .canonicalUrl(baseUrl + "/about")
                .openGraph(SeoMetadataResponse.OpenGraph.builder()
                        .type("profile")
                        .url(baseUrl + "/about")
                        .title(getLocalizedTitle("about", locale))
                        .description(getLocalizedDescription("about", locale))
                        .image(baseUrl + "/images/og-image.png")
                        .siteName(siteName)
                        .locale(locale)
                        .build())
                .twitterCard(SeoMetadataResponse.TwitterCard.builder()
                        .card("summary")
                        .url(baseUrl + "/about")
                        .title(getLocalizedTitle("about", locale))
                        .description(getLocalizedDescription("about", locale))
                        .image(baseUrl + "/images/og-image.png")
                        .creator("@salieri009")
                        .build())
                .robots("index, follow")
                .build();
    }
    
    /**
     * Generates keywords from project data.
     */
    private String generateKeywords(ProjectDetailResponse project) {
        StringBuilder keywords = new StringBuilder();
        keywords.append(project.getTitle()).append(", ");
        keywords.append("portfolio, ");
        keywords.append("software development, ");
        if (project.getTechStacks() != null && !project.getTechStacks().isEmpty()) {
            keywords.append(project.getTechStacks().stream()
                    .collect(Collectors.joining(", ")));
        }
        return keywords.toString();
    }
    
    /**
     * Generates JSON-LD structured data for home page.
     */
    private String generateHomePageStructuredData(String locale) {
        try {
            Map<String, Object> structuredData = new HashMap<>();
            structuredData.put("@context", "https://schema.org");
            structuredData.put("@type", "Person");
            structuredData.put("name", "salieri009");
            structuredData.put("jobTitle", "Full Stack Developer");
            structuredData.put("url", baseUrl);
            structuredData.put("sameAs", new String[]{
                "https://github.com/salieri009",
                "https://www.linkedin.com/in/salieri009"
            });
            
            return objectMapper.writeValueAsString(structuredData);
        } catch (Exception e) {
            log.error("Failed to generate structured data", e);
            return null;
        }
    }
    
    /**
     * Generates JSON-LD structured data for project page.
     */
    private String generateProjectStructuredData(ProjectDetailResponse project) {
        try {
            Map<String, Object> structuredData = new HashMap<>();
            structuredData.put("@context", "https://schema.org");
            structuredData.put("@type", "SoftwareApplication");
            structuredData.put("name", project.getTitle());
            structuredData.put("description", project.getSummary());
            structuredData.put("url", baseUrl + "/projects/" + project.getId());
            
            if (project.getGithubUrl() != null) {
                structuredData.put("codeRepository", project.getGithubUrl());
            }
            
            if (project.getDemoUrl() != null) {
                structuredData.put("applicationCategory", "WebApplication");
                structuredData.put("operatingSystem", "Web");
            }
            
            if (project.getTechStacks() != null && !project.getTechStacks().isEmpty()) {
                structuredData.put("programmingLanguage", project.getTechStacks());
            }
            
            return objectMapper.writeValueAsString(structuredData);
        } catch (Exception e) {
            log.error("Failed to generate project structured data", e);
            return null;
        }
    }
    
    /**
     * Gets localized title.
     */
    private String getLocalizedTitle(String page, String locale) {
        Map<String, Map<String, String>> titles = Map.of(
            "home", Map.of(
                "ko", "salieri009 - Tech Portfolio | 풀스택 개발자",
                "en", "salieri009 - Tech Portfolio | Full Stack Developer",
                "ja", "salieri009 - Tech Portfolio | フルスタック開発者"
            ),
            "projects", Map.of(
                "ko", "프로젝트",
                "en", "Projects",
                "ja", "プロジェクト"
            ),
            "academics", Map.of(
                "ko", "학업 과정",
                "en", "Academics",
                "ja", "学業課程"
            ),
            "about", Map.of(
                "ko", "소개",
                "en", "About",
                "ja", "について"
            )
        );
        
        return titles.getOrDefault(page, Map.of())
                .getOrDefault(locale, titles.get(page).get("en"));
    }
    
    /**
     * Gets localized description.
     */
    private String getLocalizedDescription(String page, String locale) {
        Map<String, Map<String, String>> descriptions = Map.of(
            "home", Map.of(
                "ko", "React, Spring Boot, MongoDB를 활용한 풀스택 개발자 salieri009의 포트폴리오입니다. 프로젝트와 기술 전문성을 확인해보세요.",
                "en", "Full Stack Developer specializing in React, Spring Boot, and MongoDB. Explore my projects and technical expertise.",
                "ja", "React、Spring Boot、MongoDBを活用したフルスタック開発者salieri009のポートフォリオです。プロジェクトと技術専門性をご確認ください。"
            ),
            "projects", Map.of(
                "ko", "프로젝트 포트폴리오를 확인하세요. 다양한 기술 스택을 활용한 웹 애플리케이션 개발 프로젝트입니다.",
                "en", "Explore my project portfolio. Web application development projects using various technology stacks.",
                "ja", "プロジェクトポートフォリオをご確認ください。様々な技術スタックを活用したウェブアプリケーション開発プロジェクトです。"
            ),
            "academics", Map.of(
                "ko", "학업 과정 및 성적을 확인하세요. UTS에서의 컴퓨터 과학 학습 경험을 공유합니다.",
                "en", "View my academic journey and achievements. Sharing my computer science learning experience at UTS.",
                "ja", "学業課程と成績をご確認ください。UTSでのコンピュータサイエンス学習経験を共有します。"
            ),
            "about", Map.of(
                "ko", "풀스택 개발자 salieri009에 대해 알아보세요. 개발 여정과 목표를 공유합니다.",
                "en", "Learn about Full Stack Developer salieri009. Sharing my development journey and goals.",
                "ja", "フルスタック開発者salieri009についてご紹介します。開発の旅と目標を共有します。"
            )
        );
        
        return descriptions.getOrDefault(page, Map.of())
                .getOrDefault(locale, descriptions.get(page).get("en"));
    }
}

