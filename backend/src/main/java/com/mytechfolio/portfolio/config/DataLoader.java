package com.mytechfolio.portfolio.config;

import com.mytechfolio.portfolio.security.entity.Role;
import com.mytechfolio.portfolio.security.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {
    
    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);
    
    private final RoleRepository roleRepository;
    
    @Autowired
    public DataLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        loadRoles();
    }
    
    private void loadRoles() {
        // Create USER role if not exists
        if (!roleRepository.existsByName("USER")) {
            Role userRole = new Role();
            userRole.setName("USER");
            userRole.setDescription("Default user role");
            roleRepository.save(userRole);
            log.info("Created USER role");
        }
        
        // Create ADMIN role if not exists
        if (!roleRepository.existsByName("ADMIN")) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            adminRole.setDescription("Administrator role with full access");
            roleRepository.save(adminRole);
            log.info("Created ADMIN role");
        }
        
        log.info("Data loading completed");
    }
}
