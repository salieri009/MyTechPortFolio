package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.RevokedJwtToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RevokedJwtTokenRepository extends MongoRepository<RevokedJwtToken, String> {
}
