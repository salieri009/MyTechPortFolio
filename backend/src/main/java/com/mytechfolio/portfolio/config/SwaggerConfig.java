package com.mytechfolio.portfolio.config;

import com.mytechfolio.portfolio.constants.ApiConstants;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Swagger/OpenAPI configuration for API documentation.
 * Provides comprehensive API documentation for frontend developers.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MyTechPortfolio API")
                        .version("1.0.0")
                        .description("RESTful API for MyTechPortfolio - A modern full-stack portfolio website")
                        .contact(new Contact()
                                .name("MyTechPortfolio Team")
                                .url("https://salieri009.studio")
                                .email("contact@salieri009.studio"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development Server"),
                        new Server()
                                .url("https://api.salieri009.studio")
                                .description("Production Server")
                ));
    }
}

