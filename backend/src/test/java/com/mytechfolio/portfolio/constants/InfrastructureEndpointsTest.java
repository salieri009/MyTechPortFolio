package com.mytechfolio.portfolio.constants;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Guards against accidentally permitting unauthenticated access to actuator prometheus.
 */
class InfrastructureEndpointsTest {

    @Test
    void infrastructureAllowListDoesNotIncludePrometheus() {
        for (String pattern : SecurityConstants.INFRASTRUCTURE_ENDPOINTS) {
            assertThat(pattern.toLowerCase())
                    .as("Prometheus must stay authenticated: %s", pattern)
                    .doesNotContain("prometheus");
        }
    }
}
