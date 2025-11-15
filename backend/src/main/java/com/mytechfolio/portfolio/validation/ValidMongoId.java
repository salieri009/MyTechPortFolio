package com.mytechfolio.portfolio.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Validates MongoDB ObjectId format.
 * Security: Prevents NoSQL injection attacks.
 */
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MongoIdValidator.class)
@Documented
public @interface ValidMongoId {
    String message() default "Invalid MongoDB ObjectId format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    boolean allowEmpty() default false;
}

