package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT DISTINCT p FROM Project p " +
           "LEFT JOIN FETCH p.techStacks ts " +
           "LEFT JOIN FETCH p.academics a " +
           "WHERE (:techStacks IS NULL OR ts.name IN :techStacks) " +
           "AND (:year IS NULL OR YEAR(p.startDate) = :year OR YEAR(p.endDate) = :year)")
    Page<Project> findProjectsWithFilters(@Param("techStacks") List<String> techStacks,
                                          @Param("year") Integer year,
                                          Pageable pageable);

    @Query("SELECT p FROM Project p " +
           "LEFT JOIN FETCH p.techStacks " +
           "LEFT JOIN FETCH p.academics " +
           "WHERE p.id = :id")
    Optional<Project> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM Project p " +
           "LEFT JOIN FETCH p.techStacks " +
           "ORDER BY p.endDate DESC")
    List<Project> findAllWithTechStacks();
}
