package com.mytechfolio.portfolio.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Validates a list of MongoDB ObjectIds.
 * Security: Prevents NoSQL injection in list parameters.
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MongoIdListValidator.class)
@Documented
public @interface ValidMongoIdList {
    String message() default "List contains invalid MongoDB ObjectIds";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    boolean allowEmpty() default false;
    int maxSize() default 100; // Security: Prevent DoS with large lists
}

