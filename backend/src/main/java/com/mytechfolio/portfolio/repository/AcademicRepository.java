package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.Academic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicRepository extends JpaRepository<Academic, Long> {

    @Query("SELECT a FROM Academic a WHERE (:semester IS NULL OR a.semester LIKE %:semester%)")
    Page<Academic> findBySemesterContaining(@Param("semester") String semester, Pageable pageable);

    @Query("SELECT a FROM Academic a " +
           "LEFT JOIN FETCH a.projects " +
           "WHERE a.id = :id")
    Optional<Academic> findByIdWithProjects(@Param("id") Long id);
}
