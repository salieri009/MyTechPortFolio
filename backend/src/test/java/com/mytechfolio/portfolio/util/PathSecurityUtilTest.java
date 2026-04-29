package com.mytechfolio.portfolio.util;

import org.junit.jupiter.api.Test;

import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PathSecurityUtilTest {

    @Test
    void sanitizePathSegmentStripsTraversal() {
        assertThat(PathSecurityUtil.sanitizePathSegment("..")).isEqualTo("file");
        assertThat(PathSecurityUtil.sanitizePathSegment("a/../b")).isEqualTo("b");
        assertThat(PathSecurityUtil.sanitizePathSegment("safe.pdf")).isEqualTo("safe.pdf");
    }

    @Test
    void normalizeRelativeStoragePathRejectsEmpty() {
        assertThatThrownBy(() -> PathSecurityUtil.normalizeRelativeStoragePath(""))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void resolveUnderBaseRejectsEscape() {
        Path base = Path.of("target", "uploads-test").toAbsolutePath().normalize();
        assertThatThrownBy(() -> PathSecurityUtil.resolveUnderBase(base, "../outside"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void resolveUnderBaseAllowsNested() {
        Path base = Path.of("target", "uploads-test").toAbsolutePath().normalize();
        Path resolved = PathSecurityUtil.resolveUnderBase(base, "projects/abc");
        assertThat(resolved.startsWith(base)).isTrue();
    }
}
