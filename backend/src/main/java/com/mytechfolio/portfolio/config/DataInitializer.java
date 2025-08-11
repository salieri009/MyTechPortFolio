package com.mytechfolio.portfolio.config;

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
                    // Frontend
                    TechStack.builder().name("React").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg").build(),
                    TechStack.builder().name("TypeScript").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg").build(),
                    TechStack.builder().name("JavaScript").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg").build(),
                    TechStack.builder().name("Vue.js").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg").build(),
                    TechStack.builder().name("HTML5").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg").build(),
                    TechStack.builder().name("CSS3").type(TechStack.TechType.Frontend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg").build(),
                    
                    // Backend
                    TechStack.builder().name("Spring Boot").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg").build(),
                    TechStack.builder().name("Java").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg").build(),
                    TechStack.builder().name("Node.js").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg").build(),
                    TechStack.builder().name("Python").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg").build(),
                    TechStack.builder().name("Express.js").type(TechStack.TechType.Backend).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg").build(),
                    
                    // Database
                    TechStack.builder().name("MySQL").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg").build(),
                    TechStack.builder().name("PostgreSQL").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg").build(),
                    TechStack.builder().name("MongoDB").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg").build(),
                    TechStack.builder().name("Redis").type(TechStack.TechType.DB).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg").build(),
                    
                    // DevOps
                    TechStack.builder().name("Docker").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg").build(),
                    TechStack.builder().name("AWS").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg").build(),
                    TechStack.builder().name("Git").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg").build(),
                    TechStack.builder().name("GitHub Actions").type(TechStack.TechType.DevOps).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg").build(),
                    
                    // Tools
                    TechStack.builder().name("IntelliJ IDEA").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg").build(),
                    TechStack.builder().name("VS Code").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg").build(),
                    TechStack.builder().name("Figma").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg").build(),
                    TechStack.builder().name("Postman").type(TechStack.TechType.Other).logoUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg").build()
                );
                techStackRepository.saveAll(techStacks);
            }
            
            // Initialize Academics if empty
            if (academicRepository.count() == 0) {
                List<Academic> academics = List.of(
                    Academic.builder()
                        .courseName("웹 프로그래밍")
                        .semester("2024-1")
                        .professor("김교수")
                        .description("HTML, CSS, JavaScript를 활용한 웹 개발 기초")
                        .build(),
                    Academic.builder()
                        .courseName("데이터베이스 설계")
                        .semester("2024-1")
                        .professor("이교수")
                        .description("관계형 데이터베이스 설계 및 SQL 활용")
                        .build(),
                    Academic.builder()
                        .courseName("소프트웨어 공학")
                        .semester("2024-2")
                        .professor("박교수")
                        .description("소프트웨어 개발 방법론 및 프로젝트 관리")
                        .build(),
                    Academic.builder()
                        .courseName("모바일 앱 개발")
                        .semester("2024-2")
                        .professor("최교수")
                        .description("Android 및 iOS 앱 개발 실습")
                        .build()
                );
                academicRepository.saveAll(academics);
            }
            
            // Initialize Projects if empty
            if (projectRepository.count() == 0) {
                // Fetch saved entities for relationships
                List<TechStack> allTechStacks = techStackRepository.findAll();
                List<Academic> allAcademics = academicRepository.findAll();
                
                // Get specific tech stacks
                TechStack react = allTechStacks.stream().filter(ts -> ts.getName().equals("React")).findFirst().orElse(null);
                TechStack typescript = allTechStacks.stream().filter(ts -> ts.getName().equals("TypeScript")).findFirst().orElse(null);
                TechStack springBoot = allTechStacks.stream().filter(ts -> ts.getName().equals("Spring Boot")).findFirst().orElse(null);
                TechStack java = allTechStacks.stream().filter(ts -> ts.getName().equals("Java")).findFirst().orElse(null);
                TechStack mysql = allTechStacks.stream().filter(ts -> ts.getName().equals("MySQL")).findFirst().orElse(null);
                TechStack docker = allTechStacks.stream().filter(ts -> ts.getName().equals("Docker")).findFirst().orElse(null);
                
                List<Project> projects = List.of(
                    Project.builder()
                        .title("포트폴리오 웹사이트")
                        .summary("React와 Spring Boot를 활용한 개인 포트폴리오 웹사이트")
                        .description("개인 프로젝트와 학업 성과를 보여주는 반응형 웹사이트입니다. 프론트엔드는 React + TypeScript로, 백엔드는 Spring Boot로 개발했습니다.")
                        .startDate(LocalDate.of(2024, 1, 15))
                        .endDate(LocalDate.of(2024, 3, 20))
                        .githubUrl("https://github.com/example/portfolio")
                        .demoUrl("https://portfolio.example.com")
                        .techStacks(List.of(react, typescript, springBoot, java, mysql).stream().filter(ts -> ts != null).toList())
                        .academics(allAcademics.subList(0, 2))
                        .build(),
                        
                    Project.builder()
                        .title("할일 관리 앱")
                        .summary("Vue.js로 만든 할일 관리 애플리케이션")
                        .description("사용자가 할일을 추가, 수정, 삭제할 수 있는 간단한 웹 애플리케이션입니다. 로컬 스토리지를 활용하여 데이터를 저장합니다.")
                        .startDate(LocalDate.of(2024, 4, 1))
                        .endDate(LocalDate.of(2024, 5, 15))
                        .githubUrl("https://github.com/example/todo-app")
                        .demoUrl("https://todo.example.com")
                        .techStacks(List.of(allTechStacks.stream().filter(ts -> ts.getName().equals("Vue.js")).findFirst().orElse(null)).stream().filter(ts -> ts != null).toList())
                        .academics(List.of(allAcademics.get(0)))
                        .build(),
                        
                    Project.builder()
                        .title("온라인 쇼핑몰")
                        .summary("Spring Boot와 MySQL을 활용한 쇼핑몰 시스템")
                        .description("상품 관리, 주문 처리, 사용자 관리 기능을 포함한 온라인 쇼핑몰입니다. RESTful API 설계와 JWT 인증을 적용했습니다.")
                        .startDate(LocalDate.of(2024, 6, 1))
                        .endDate(null) // 진행중
                        .githubUrl("https://github.com/example/shopping-mall")
                        .techStacks(List.of(springBoot, java, mysql, docker).stream().filter(ts -> ts != null).toList())
                        .academics(allAcademics.subList(1, 3))
                        .build()
                );
                
                projectRepository.saveAll(projects);
            }
        };
    }
}
