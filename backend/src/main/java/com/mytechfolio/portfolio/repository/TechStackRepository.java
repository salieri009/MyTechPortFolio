package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.TechStack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechStackRepository extends JpaRepository<TechStack, Long> {

    List<TechStack> findByType(TechStack.TechType type);
    
    List<TechStack> findByIdIn(List<Long> ids);
    
    Optional<TechStack> findByName(String name);
}
