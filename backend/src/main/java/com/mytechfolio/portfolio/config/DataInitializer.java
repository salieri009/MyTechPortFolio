package com.mytechfolio.portfolio.config;

// Temporarily disabled during MongoDB migration
/*
import com.mytechfolio.portfolio.domain.Academic;
import com.mytechfolio.portfolio.domain.Project;
import com.mytechfolio.portfolio.domain.TechStack;
import com.mytechfolio.portfolio.repository.AcademicRepository;
import com.mytechfolio.portfolio.repository.ProjectRepository;
import com.mytechfolio.portfolio.repository.TechStackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            TechStackRepository techStackRepository,
            AcademicRepository academicRepository,
            ProjectRepository projectRepository) {
        
        return args -> {
            // Initialize Tech Stacks if empty
            if (techStackRepository.count() == 0) {
                List<TechStack> techStacks = List.of(
                    // Frontend Frameworks & Libraries
                    TechStack.builder().name("React").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg").build(),
                    TechStack.builder().name("TypeScript").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg").build(),
                    TechStack.builder().name("JavaScript").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg").build(),
                    TechStack.builder().name("Vue.js").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg").build(),
                    TechStack.builder().name("Angular").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg").build(),
                    TechStack.builder().name("Next.js").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg").build(),
                    TechStack.builder().name("Nuxt.js").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg").build(),
                    TechStack.builder().name("Svelte").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg").build(),
                    TechStack.builder().name("HTML5").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg").build(),
                    TechStack.builder().name("CSS3").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg").build(),
                    TechStack.builder().name("Sass").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg").build(),
                    TechStack.builder().name("Tailwind CSS").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg").build(),
                    TechStack.builder().name("Styled Components").type(TechStack.TechType.Frontend).logoUrl("https://styled-components.com/logo.png").build(),
                    TechStack.builder().name("Material-UI").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg").build(),
                    TechStack.builder().name("Bootstrap").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg").build(),
                    
                    // Backend Languages & Frameworks
                    TechStack.builder().name("Spring Boot").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg").build(),
                    TechStack.builder().name("Java").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg").build(),
                    TechStack.builder().name("Node.js").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg").build(),
                    TechStack.builder().name("Python").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg").build(),
                    TechStack.builder().name("Express.js").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg").build(),
                    TechStack.builder().name("FastAPI").type(TechStack.TechType.Backend).logoUrl("https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png").build(),
                    TechStack.builder().name("Django").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg").build(),
                    TechStack.builder().name("Flask").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg").build(),
                    TechStack.builder().name("NestJS").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg").build(),
                    TechStack.builder().name("C#").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg").build(),
                    TechStack.builder().name(".NET").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg").build(),
                    TechStack.builder().name("Go").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg").build(),
                    TechStack.builder().name("Rust").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg").build(),
                    TechStack.builder().name("PHP").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg").build(),
                    TechStack.builder().name("Laravel").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg").build(),
                    
                    // Databases
                    TechStack.builder().name("MySQL").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg").build(),
                    TechStack.builder().name("PostgreSQL").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg").build(),
                    TechStack.builder().name("MongoDB").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg").build(),
                    TechStack.builder().name("Redis").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg").build(),
                    TechStack.builder().name("SQLite").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg").build(),
                    TechStack.builder().name("Oracle").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg").build(),
                    TechStack.builder().name("Elasticsearch").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg").build(),
                    TechStack.builder().name("Firebase").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg").build(),
                    TechStack.builder().name("Supabase").type(TechStack.TechType.DB).logoUrl("https://supabase.com/brand-assets/supabase-logo-icon.png").build(),
                    
                    // DevOps & Cloud
                    TechStack.builder().name("Docker").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg").build(),
                    TechStack.builder().name("Kubernetes").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg").build(),
                    TechStack.builder().name("AWS").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg").build(),
                    TechStack.builder().name("Azure").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg").build(),
                    TechStack.builder().name("Google Cloud").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg").build(),
                    TechStack.builder().name("Terraform").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg").build(),
                    TechStack.builder().name("Jenkins").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg").build(),
                    TechStack.builder().name("GitLab CI").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg").build(),
                    TechStack.builder().name("GitHub Actions").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg").build(),
                    TechStack.builder().name("Nginx").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg").build(),
                    TechStack.builder().name("Apache").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg").build(),
                    TechStack.builder().name("Vercel").type(TechStack.TechType.DevOps).logoUrl("https://vercel.com/favicon.ico").build(),
                    TechStack.builder().name("Netlify").type(TechStack.TechType.DevOps).logoUrl("https://www.netlify.com/favicon.ico").build(),
                    
                    // Version Control & Collaboration
                    TechStack.builder().name("Git").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg").build(),
                    TechStack.builder().name("GitHub").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg").build(),
                    TechStack.builder().name("GitLab").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg").build(),
                    TechStack.builder().name("Bitbucket").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg").build(),
                    
                    // Development Tools & IDEs
                    TechStack.builder().name("IntelliJ IDEA").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg").build(),
                    TechStack.builder().name("VS Code").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg").build(),
                    TechStack.builder().name("WebStorm").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webstorm/webstorm-original.svg").build(),
                    TechStack.builder().name("PyCharm").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg").build(),
                    TechStack.builder().name("Eclipse").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg").build(),
                    TechStack.builder().name("Vim").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg").build(),
                    
                    // Design & Prototyping Tools
                    TechStack.builder().name("Figma").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg").build(),
                    TechStack.builder().name("Adobe XD").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg").build(),
                    TechStack.builder().name("Sketch").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg").build(),
                    TechStack.builder().name("Photoshop").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg").build(),
                    
                    // API & Testing Tools
                    TechStack.builder().name("Postman").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg").build(),
                    TechStack.builder().name("Insomnia").type(TechStack.TechType.Other).logoUrl("https://insomnia.rest/favicon.ico").build(),
                    TechStack.builder().name("Jest").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg").build(),
                    TechStack.builder().name("Cypress").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cypress/cypress-original.svg").build(),
                    TechStack.builder().name("Selenium").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg").build(),
                    TechStack.builder().name("JUnit").type(TechStack.TechType.Other).logoUrl("https://junit.org/junit5/assets/img/junit5-logo.png").build(),
                    
                    // Mobile Development
                    TechStack.builder().name("React Native").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg").build(),
                    TechStack.builder().name("Flutter").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg").build(),
                    TechStack.builder().name("Dart").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg").build(),
                    TechStack.builder().name("Swift").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg").build(),
                    TechStack.builder().name("Kotlin").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg").build(),
                    
                    // Build Tools & Package Managers
                    TechStack.builder().name("Webpack").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg").build(),
                    TechStack.builder().name("Vite").type(TechStack.TechType.Other).logoUrl("https://vitejs.dev/logo.svg").build(),
                    TechStack.builder().name("npm").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg").build(),
                    TechStack.builder().name("Yarn").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg").build(),
                    TechStack.builder().name("Maven").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg").build(),
                    TechStack.builder().name("Gradle").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gradle/gradle-plain.svg").build(),
                    
                    // Operating Systems
                    TechStack.builder().name("Linux").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg").build(),
                    TechStack.builder().name("Ubuntu").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg").build(),
                    TechStack.builder().name("Windows").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg").build(),
                    TechStack.builder().name("macOS").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg").build()
                );
                techStackRepository.saveAll(techStacks);
                System.out.println("Initialized " + techStacks.size() + " Tech Stack records");
            }
            
            // Initialize Academics if empty
            if (academicRepository.count() == 0) {
                List<Academic> academics = List.of(
                    Academic.builder()
                        .name("Programming 1")
                        .semester("2023 Spring")
                        .grade("HD")
                        .description("Introduction to programming concepts using Java")
                        .build(),
                    Academic.builder()
                        .name("Data Structures and Algorithms")
                        .semester("2023 Spring")
                        .grade("D")
                        .description("Fundamental data structures and algorithmic thinking")
                        .build(),
                    Academic.builder()
                        .name("Mathematical Modelling")
                        .semester("2023 Spring")
                        .grade("C")
                        .description("Mathematical foundations for IT applications")
                        .build(),
                    Academic.builder()
                        .name("Business Information Systems")
                        .semester("2023 Spring")
                        .grade("D")
                        .description("Business processes and information systems")
                        .build(),
                    Academic.builder()
                        .name("Programming 2")
                        .semester("2023 Autumn")
                        .grade("HD")
                        .description("Advanced programming concepts and OOP")
                        .build(),
                    Academic.builder()
                        .name("Software Development")
                        .semester("2023 Autumn")
                        .grade("D")
                        .description("Software development lifecycle and methodologies")
                        .build(),
                    Academic.builder()
                        .name("Database Design")
                        .semester("2023 Autumn")
                        .grade("HD")
                        .description("Database design and SQL programming")
                        .build(),
                    Academic.builder()
                        .name("Web Technologies")
                        .semester("2023 Autumn")
                        .grade("HD")
                        .description("HTML, CSS, JavaScript and web development")
                        .build(),
                    Academic.builder()
                        .name("Object-Oriented Programming")
                        .semester("2024 Spring")
                        .grade("HD")
                        .description("Advanced OOP concepts and design patterns")
                        .build(),
                    Academic.builder()
                        .name("Web Systems")
                        .semester("2024 Spring")
                        .grade("D")
                        .description("Full-stack web development")
                        .build()
                );
                academicRepository.saveAll(academics);
                System.out.println("Initialized " + academics.size() + " Academic records");
            }
            
            // Initialize Projects if empty
            if (projectRepository.count() == 0) {
                // Fetch saved entities for relationships
                List<TechStack> allTechStacks = techStackRepository.findAll();
                
                // Get specific tech stacks
                TechStack react = allTechStacks.stream().filter(ts -> ts.getName().equals("React")).findFirst().orElse(null);
                TechStack typescript = allTechStacks.stream().filter(ts -> ts.getName().equals("TypeScript")).findFirst().orElse(null);
                TechStack springBoot = allTechStacks.stream().filter(ts -> ts.getName().equals("Spring Boot")).findFirst().orElse(null);
                TechStack java = allTechStacks.stream().filter(ts -> ts.getName().equals("Java")).findFirst().orElse(null);
                TechStack mysql = allTechStacks.stream().filter(ts -> ts.getName().equals("MySQL")).findFirst().orElse(null);
                TechStack docker = allTechStacks.stream().filter(ts -> ts.getName().equals("Docker")).findFirst().orElse(null);
                
                List<Project> projects = List.of(
                    Project.builder()
                        .title("MyTechPortfolio - Personal Portfolio Website")
                        .summary("Full-stack portfolio application showcasing academic achievements and technical projects")
                        .description("A comprehensive portfolio website built with React TypeScript frontend and Spring Boot backend. Features include academic record display, project showcases, and technical skills visualization. Implements responsive design, REST API architecture, and comprehensive testing framework.")
                        .startDate(LocalDate.of(2024, 7, 1))
                        .endDate(LocalDate.of(2024, 8, 11))
                        .githubUrl("https://github.com/salieri009/MyTechPortfolio")
                        .demoUrl("https://mytechportfolio.vercel.app")
                        .techStacks(List.of(react, typescript, springBoot, java, mysql).stream().filter(ts -> ts != null).toList())
                        .build(),
                        
                    Project.builder()
                        .title("E-Commerce Platform")
                        .summary("Full-featured online shopping platform with payment integration")
                        .description("Developed a complete e-commerce solution with user authentication, product catalog, shopping cart, order management, and payment processing. Includes admin dashboard for inventory management and sales analytics.")
                        .startDate(LocalDate.of(2024, 3, 15))
                        .endDate(LocalDate.of(2024, 6, 30))
                        .githubUrl("https://github.com/salieri009/ecommerce-platform")
                        .demoUrl("https://ecommerce-demo.vercel.app")
                        .techStacks(List.of(react, typescript, springBoot, java, mysql, docker).stream().filter(ts -> ts != null).toList())
                        .build(),
                        
                    Project.builder()
                        .title("Task Management System")
                        .summary("Collaborative project management tool with real-time updates")
                        .description("Built a Kanban-style task management application with drag-and-drop functionality, real-time collaboration, file attachments, and progress tracking. Features team workspace management and detailed project analytics.")
                        .startDate(LocalDate.of(2024, 1, 10))
                        .endDate(LocalDate.of(2024, 3, 5))
                        .githubUrl("https://github.com/salieri009/task-manager")
                        .demoUrl("https://taskflow-manager.netlify.app")
                        .techStacks(List.of(react, typescript, allTechStacks.stream().filter(ts -> ts.getName().equals("Node.js")).findFirst().orElse(null), allTechStacks.stream().filter(ts -> ts.getName().equals("MongoDB")).findFirst().orElse(null)).stream().filter(ts -> ts != null).toList())
                        .build(),
                        
                    Project.builder()
                        .title("Weather Analytics Dashboard")
                        .summary("Data visualization platform for weather patterns and climate analysis")
                        .description("Created an interactive dashboard that aggregates weather data from multiple APIs, provides historical trend analysis, and generates predictive insights. Features include customizable charts, location-based forecasts, and data export functionality.")
                        .startDate(LocalDate.of(2023, 11, 1))
                        .endDate(LocalDate.of(2024, 1, 5))
                        .githubUrl("https://github.com/salieri009/weather-dashboard")
                        .demoUrl("https://weather-analytics.herokuapp.com")
                        .techStacks(List.of(allTechStacks.stream().filter(ts -> ts.getName().equals("Vue.js")).findFirst().orElse(null), allTechStacks.stream().filter(ts -> ts.getName().equals("Python")).findFirst().orElse(null), allTechStacks.stream().filter(ts -> ts.getName().equals("PostgreSQL")).findFirst().orElse(null)).stream().filter(ts -> ts != null).toList())
                        .build(),
                        
                    Project.builder()
                        .title("Social Media Content Scheduler")
                        .summary("Automated social media management platform")
                        .description("Developed a comprehensive social media management tool that allows users to schedule posts across multiple platforms, analyze engagement metrics, and manage content calendars. Integrated with major social media APIs and includes AI-powered content suggestions.")
                        .startDate(LocalDate.of(2023, 8, 15))
                        .endDate(LocalDate.of(2023, 10, 30))
                        .githubUrl("https://github.com/salieri009/social-scheduler")
                        .techStacks(List.of(react, allTechStacks.stream().filter(ts -> ts.getName().equals("Node.js")).findFirst().orElse(null), allTechStacks.stream().filter(ts -> ts.getName().equals("Express.js")).findFirst().orElse(null), allTechStacks.stream().filter(ts -> ts.getName().equals("MongoDB")).findFirst().orElse(null)).stream().filter(ts -> ts != null).toList())
                        .build(),
                        
                    Project.builder()
                        .title("Real-Time Chat Application")
                        .summary("WebSocket-based messaging platform with file sharing")
                        .description("Built a real-time messaging application with features including group chats, file sharing, emoji reactions, message encryption, and user presence indicators. Supports both web and mobile platforms with offline message synchronization.")
                        .startDate(LocalDate.of(2023, 5, 1))
                        .endDate(LocalDate.of(2023, 7, 31))
                        .githubUrl("https://github.com/salieri009/realtime-chat")
                        .demoUrl("https://chat-app-realtime.vercel.app")
                        .techStacks(List.of(react, typescript, allTechStacks.stream().filter(ts -> ts.getName().equals("Node.js")).findFirst().orElse(null), allTechStacks.stream().filter(ts -> ts.getName().equals("Redis")).findFirst().orElse(null)).stream().filter(ts -> ts != null).toList())
                        .build(),
                        
                    Project.builder()
                        .title("AI-Powered Code Review Assistant")
                        .summary("Machine learning tool for automated code analysis and suggestions")
                        .description("Currently developing an AI assistant that analyzes code quality, suggests improvements, detects potential bugs, and provides performance optimization recommendations. Integrates with popular IDEs and version control systems.")
                        .startDate(LocalDate.of(2024, 6, 1))
                        .endDate(LocalDate.of(2024, 12, 31)) // Projected completion date
                        .githubUrl("https://github.com/salieri009/ai-code-reviewer")
                        .techStacks(List.of(allTechStacks.stream().filter(ts -> ts.getName().equals("Python")).findFirst().orElse(null), react, typescript, allTechStacks.stream().filter(ts -> ts.getName().equals("PostgreSQL")).findFirst().orElse(null), docker).stream().filter(ts -> ts != null).toList())
                        .build()
                );
                
                projectRepository.saveAll(projects);
            }
        };
    }
*/
