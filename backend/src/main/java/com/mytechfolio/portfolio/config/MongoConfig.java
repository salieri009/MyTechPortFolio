package com.mytechfolio.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

// Rely on Spring Boot auto-configuration for MongoDB so that spring.data.mongodb.uri is respected
@Configuration
@EnableMongoRepositories(basePackages = "com.mytechfolio.portfolio.repository")
public class MongoConfig { }
