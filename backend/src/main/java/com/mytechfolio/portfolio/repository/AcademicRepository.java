package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.Academic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicRepository extends MongoRepository<Academic, String> {
    
    // Find by semester
    Page<Academic> findBySemesterContainingIgnoreCase(String semester, Pageable pageable);
    
    // Find by semester (alias for compatibility)
    Page<Academic> findBySemesterContaining(String semester, Pageable pageable);
    
    // Find by status
    Page<Academic> findByStatus(Academic.AcademicStatus status, Pageable pageable);
    
    // Find by grade (only completed subjects)
    Page<Academic> findByGradeIsNotNullOrderByMarksDesc(Pageable pageable);
    
    // Find high distinction subjects
    @Query("{'grade': 'HIGH DISTINCTION'}")
    List<Academic> findHighDistinctionSubjects();
    
    // Find by credit points
    Page<Academic> findByCreditPoints(Integer creditPoints, Pageable pageable);
    
    // Find by name containing (search)
    Page<Academic> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // Find enrolled subjects
    @Query("{'status': 'ENROLLED'}")
    List<Academic> findEnrolledSubjects();
    
    // Find completed subjects ordered by marks
    @Query("{'status': 'COMPLETED'}")
    Page<Academic> findCompletedSubjectsOrderByMarks(Pageable pageable);
    
    // Calculate total credit points
    @Query(value = "{'status': 'COMPLETED'}", count = false)
    List<Academic> findCompletedSubjects();
    
    // Find by semester and year
    @Query("{'semester': {$regex: ?0, $options: 'i'}}")
    List<Academic> findBySemesterPattern(String semesterPattern);
    
    // Find subjects with marks above threshold
    @Query("{'marks': {$gte: ?0}}")
    List<Academic> findSubjectsWithMarksAbove(Integer marks);
    
    // Find by ID with projects (compatibility method - just use findById)
    default Optional<Academic> findByIdWithProjects(String id) {
        return findById(id);
    }
}
