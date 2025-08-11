# 성능 테스트

## 목적
MyTechPortfolio 애플리케이션의 성능을 다양한 관점에서 측정하고 최적화 포인트를 식별하여 우수한 사용자 경험을 보장

## 테스트 범위
- Frontend 렌더링 성능
- Backend API 응답 시간
- Database 쿼리 성능
- 네트워크 통신 최적화
- 메모리 사용량 및 최적화
- 로드 테스트 및 확장성

## 1. Frontend 성능 테스트

### 1.1 페이지 로드 성능

#### 테스트 케이스 1.1.1: 초기 페이지 로드 시간
**측정 도구**: Chrome DevTools Performance 탭

**테스트 시나리오**:
1. 캐시 비우기 (Ctrl+Shift+R)
2. Network: Regular 3G로 설정
3. 각 페이지별 로드 시간 측정

**측정 페이지**:
```
- Home: http://localhost:5174/
- Projects: http://localhost:5174/projects  
- Academics: http://localhost:5174/academics
- Tech Stacks: http://localhost:5174/tech-stacks
```

**성능 목표**:
```
First Contentful Paint (FCP): < 1.5초
Largest Contentful Paint (LCP): < 2.5초
Time to Interactive (TTI): < 3.5초
Cumulative Layout Shift (CLS): < 0.1
First Input Delay (FID): < 100ms
```

**측정 방법**:
```bash
# Lighthouse CLI 사용
npm install -g lighthouse
lighthouse http://localhost:5174/projects --view
```

#### 테스트 케이스 1.1.2: 번들 사이즈 분석
**도구**: Vite Bundle Analyzer

**실행 명령**:
```bash
cd frontend
npm run build
npm run preview

# Bundle analyzer 실행
npx vite-bundle-analyzer dist
```

**최적화 목표**:
```
- 초기 번들 크기: < 250KB (gzipped)
- Vendor chunks: < 500KB (gzipped)
- 코드 분할로 라우트별 지연 로딩
- Tree shaking으로 불필요한 코드 제거
```

### 1.2 런타임 성능

#### 테스트 케이스 1.2.1: 스크롤 성능
**시나리오**: Projects 페이지에서 100개 프로젝트 렌더링 시 스크롤 성능

**테스트 데이터 생성**:
```typescript
// 개발용 대량 데이터 생성
const generateMockProjects = (count: number) => {
  return Array.from({length: count}, (_, i) => ({
    id: i + 1,
    title: `프로젝트 ${i + 1}`,
    summary: `프로젝트 ${i + 1}의 요약 설명`,
    // ... 기타 필드
  }));
};
```

**성능 측정**:
```
- FPS 유지: >= 60fps
- 메모리 사용량: 증가폭 < 50MB
- CPU 사용률: < 30%
- 스크롤 지연: < 16ms
```

#### 테스트 케이스 1.2.2: React 컴포넌트 렌더링 성능
**도구**: React DevTools Profiler

**측정 시나리오**:
1. 상태 변경 시 리렌더링 횟수
2. 메모이제이션 효과 확인
3. 불필요한 리렌더링 식별

**최적화 체크리스트**:
```javascript
// useMemo 적용 확인
const expensiveValue = useMemo(() => {
  return projects.filter(p => p.year === selectedYear);
}, [projects, selectedYear]);

// useCallback 적용 확인  
const handleProjectClick = useCallback((id: number) => {
  navigate(`/projects/${id}`);
}, [navigate]);

// React.memo 적용 확인
const ProjectCard = React.memo(({ project }) => {
  // 컴포넌트 구현
});
```

### 1.3 이미지 및 리소스 최적화

#### 테스트 케이스 1.3.1: 이미지 로딩 성능
**시나리오**: 프로젝트 이미지 및 아이콘 최적화

**최적화 기법**:
```typescript
// 지연 로딩 구현
const LazyImage = ({ src, alt, ...props }) => {
  return (
    <img 
      src={src}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};

// 반응형 이미지
const ResponsiveImage = ({ src, alt }) => {
  return (
    <picture>
      <source 
        media="(max-width: 768px)" 
        srcSet={`${src}-mobile.webp`} 
        type="image/webp"
      />
      <source 
        media="(max-width: 768px)" 
        srcSet={`${src}-mobile.jpg`}
      />
      <source 
        srcSet={`${src}.webp`} 
        type="image/webp"
      />
      <img src={`${src}.jpg`} alt={alt} />
    </picture>
  );
};
```

**성능 목표**:
```
- 이미지 압축률: > 70%
- WebP 형식 사용률: > 80%
- 지연 로딩 적용: 100%
- 이미지 로드 시간: < 500ms
```

## 2. Backend API 성능 테스트

### 2.1 응답 시간 측정

#### 테스트 케이스 2.1.1: 기본 CRUD 작업 성능
**측정 도구**: curl + time, Apache Bench (ab)

**테스트 시나리오**:
```bash
# 단일 요청 응답 시간
time curl -w "%{time_total}" -s -o /dev/null http://localhost:8080/api/projects

# 동시 요청 처리 성능
ab -n 1000 -c 10 http://localhost:8080/api/projects

# 다양한 엔드포인트 테스트
ab -n 500 -c 5 http://localhost:8080/api/academics
ab -n 500 -c 5 http://localhost:8080/api/tech-stacks
```

**성능 목표**:
```
단일 요청:
- GET /api/projects: < 100ms
- GET /api/academics: < 50ms  
- GET /api/tech-stacks: < 30ms

동시 요청 (10개):
- 평균 응답 시간: < 200ms
- 95% 응답 시간: < 500ms
- 에러율: 0%
```

#### 테스트 케이스 2.1.2: 페이징 성능
**시나리오**: 대량 데이터에서 페이징 성능 측정

**테스트 데이터 생성**:
```sql
-- H2 데이터베이스에 대량 테스트 데이터 삽입
INSERT INTO project (title, summary, description, start_date, end_date, github_url, demo_url)
SELECT 
  CONCAT('Test Project ', LEVEL),
  CONCAT('Summary for project ', LEVEL),
  CONCAT('Description for project ', LEVEL),
  DATE_ADD('2020-01-01', INTERVAL LEVEL DAY),
  DATE_ADD('2020-06-01', INTERVAL LEVEL DAY),
  CONCAT('https://github.com/test/project', LEVEL),
  CONCAT('https://demo.project', LEVEL, '.com')
FROM 
  (SELECT LEVEL FROM DUAL CONNECT BY LEVEL <= 10000) t;
```

**성능 테스트**:
```bash
# 첫 번째 페이지 (캐시되지 않은 상태)
curl -w "%{time_total}" "http://localhost:8080/api/projects?page=1&size=20"

# 중간 페이지
curl -w "%{time_total}" "http://localhost:8080/api/projects?page=100&size=20"

# 마지막 페이지
curl -w "%{time_total}" "http://localhost:8080/api/projects?page=500&size=20"
```

**최적화 목표**:
```
- 모든 페이지: < 150ms
- 페이지 번호와 무관하게 일정한 성능
- OFFSET 최적화로 후반 페이지 성능 개선
```

### 2.2 데이터베이스 쿼리 최적화

#### 테스트 케이스 2.2.1: N+1 쿼리 문제 해결
**시나리오**: 프로젝트와 기술 스택 조인 쿼리 최적화

**문제가 있는 쿼리**:
```java
// N+1 문제 발생 가능
@GetMapping("/projects")
public List<Project> getProjects() {
    List<Project> projects = projectRepository.findAll();
    // 각 프로젝트마다 기술 스택 쿼리 실행 (N+1)
    projects.forEach(p -> p.getTechStacks().size());
    return projects;
}
```

**최적화된 쿼리**:
```java
// Fetch Join 사용
@Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.techStacks")
List<Project> findAllWithTechStacks();

// EntityGraph 사용
@EntityGraph(attributePaths = {"techStacks"})
List<Project> findAll();
```

**성능 측정**:
```bash
# 쿼리 실행 계획 확인
EXPLAIN SELECT * FROM project p 
LEFT JOIN project_tech_stack pts ON p.id = pts.project_id
LEFT JOIN tech_stack ts ON pts.tech_stack_id = ts.id;
```

#### 테스트 케이스 2.2.2: 인덱스 성능 확인
**시나리오**: 검색 및 정렬에 자주 사용되는 컬럼의 인덱스 효과

**인덱스 생성**:
```sql
-- 프로젝트 검색용 인덱스
CREATE INDEX idx_project_title ON project(title);
CREATE INDEX idx_project_tech_stack ON project_tech_stack(project_id, tech_stack_id);
CREATE INDEX idx_project_date ON project(start_date, end_date);

-- 복합 인덱스
CREATE INDEX idx_project_search ON project(title, start_date);
```

**성능 비교**:
```bash
# 인덱스 사용 전후 응답 시간 비교
curl -w "%{time_total}" "http://localhost:8080/api/projects?search=React"
curl -w "%{time_total}" "http://localhost:8080/api/projects?year=2024"
```

### 2.3 캐싱 성능

#### 테스트 케이스 2.3.1: Spring Boot 캐싱 효과
**캐싱 구성**:
```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(
            Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofMinutes(30))
        );
        return cacheManager;
    }
}

@Service
public class ProjectService {
    
    @Cacheable(value = "projects", key = "#page + '_' + #size")
    public Page<Project> getProjects(int page, int size) {
        // 구현
    }
}
```

**캐시 효과 측정**:
```bash
# 첫 번째 요청 (캐시 미스)
time curl "http://localhost:8080/api/projects?page=1&size=20"

# 두 번째 요청 (캐시 히트)  
time curl "http://localhost:8080/api/projects?page=1&size=20"

# 캐시 효과 확인
# 첫 번째: ~100ms, 두 번째: ~10ms 예상
```

## 3. 메모리 사용량 테스트

### 3.1 Frontend 메모리 프로파일링

#### 테스트 케이스 3.1.1: 메모리 누수 검사
**도구**: Chrome DevTools Memory 탭

**테스트 시나리오**:
1. 페이지 간 네비게이션 반복 (50회)
2. 동일 페이지 새로고침 반복 (50회)
3. API 호출 반복 (100회)

**메모리 측정 포인트**:
```
- 초기 메모리 사용량
- 30분 사용 후 메모리 사용량
- 가비지 컬렉션 후 메모리 사용량
- 메모리 증가율: < 20%
```

### 3.2 Backend 메모리 프로파일링

#### 테스트 케이스 3.2.1: JVM 힙 메모리 분석
**JVM 옵션 설정**:
```bash
java -jar -Xms512m -Xmx1024m \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/tmp \
  portfolio-backend.jar
```

**메모리 모니터링**:
```bash
# JVM 메모리 사용량 모니터링
jstat -gc [PID] 5s

# 힙 덤프 분석 (OutOfMemoryError 발생 시)
jhat /tmp/java_pid[PID].hprof
```

**성능 목표**:
```
- 힙 메모리 사용률: < 80%
- Old Generation GC 빈도: < 1회/분
- GC 일시 정지 시간: < 100ms
- 메모리 누수: 0건
```

## 4. 네트워크 성능 테스트

### 4.1 API 응답 최적화

#### 테스트 케이스 4.1.1: JSON 응답 크기 최적화
**현재 응답 분석**:
```bash
# 응답 크기 측정
curl -w "%{size_download}" -s -o /dev/null http://localhost:8080/api/projects

# 압축 효과 확인
curl -H "Accept-Encoding: gzip" -w "%{size_download}" \
  -s -o /dev/null http://localhost:8080/api/projects
```

**최적화 기법**:
```java
// DTO에서 불필요한 필드 제거
@JsonView(Views.Public.class)
public class ProjectDto {
    @JsonView(Views.Public.class)
    private String title;
    
    // 관리자만 볼 수 있는 정보
    @JsonView(Views.Admin.class)
    private String internalNotes;
}

// GZIP 압축 활성화
@Configuration
public class CompressionConfig {
    @Bean
    public EmbeddedServletContainerCustomizer compressionCustomizer() {
        return container -> {
            container.setCompression(Compression.ON);
            container.setCompressionMinResponseSize(1024);
        };
    }
}
```

#### 테스트 케이스 4.1.2: HTTP/2 및 Keep-Alive 효과
**설정 확인**:
```yaml
# application.yml
server:
  http2:
    enabled: true
  compression:
    enabled: true
    min-response-size: 1024
```

**성능 측정**:
```bash
# HTTP/1.1 vs HTTP/2 비교
curl --http1.1 -w "%{time_total}" http://localhost:8080/api/projects
curl --http2 -w "%{time_total}" http://localhost:8080/api/projects
```

### 4.2 CDN 및 정적 리소스 최적화

#### 테스트 케이스 4.2.1: 정적 파일 캐싱
**Vite 빌드 최적화**:
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['styled-components']
        }
      }
    }
  }
});
```

**캐시 헤더 설정**:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
    }
}
```

## 5. 로드 테스트

### 5.1 단계별 부하 테스트

#### 테스트 케이스 5.1.1: 점진적 부하 증가
**도구**: Apache Bench, JMeter, 또는 Artillery

**테스트 시나리오**:
```bash
# 1단계: 10명 동시 사용자
ab -n 1000 -c 10 http://localhost:8080/api/projects

# 2단계: 50명 동시 사용자  
ab -n 2500 -c 50 http://localhost:8080/api/projects

# 3단계: 100명 동시 사용자
ab -n 5000 -c 100 http://localhost:8080/api/projects
```

**Artillery 스크립트**:
```yaml
# artillery-test.yml
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120  
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "Portfolio browsing"
    weight: 60
    flow:
      - get:
          url: "/api/projects"
      - think: 2
      - get:
          url: "/api/academics"
  
  - name: "Tech stack browsing"
    weight: 40
    flow:
      - get:
          url: "/api/tech-stacks"
      - think: 1
      - get:
          url: "/api/projects?techStacks=React"
```

**실행 및 분석**:
```bash
# Artillery 실행
npm install -g artillery
artillery run artillery-test.yml

# 결과 분석
# - RPS (Requests Per Second)
# - 응답 시간 분포 (95%, 99% percentile)
# - 에러율
# - 시스템 리소스 사용률
```

### 5.2 스트레스 테스트

#### 테스트 케이스 5.2.1: 시스템 한계 테스트
**목적**: 시스템 붕괴 지점 및 복구 능력 확인

**테스트 시나리오**:
```bash
# 극한 부하 테스트
ab -n 10000 -c 200 http://localhost:8080/api/projects

# 메모리 부족 시나리오
curl -X GET "http://localhost:8080/api/projects?size=10000"

# CPU 집약적 작업
curl -X GET "http://localhost:8080/api/projects?search=complex-search-term"
```

**복구 테스트**:
```
1. 극한 부하 적용
2. 시스템 응답 없음 확인
3. 부하 제거
4. 시스템 정상 복구 확인
5. 복구 시간 측정: < 30초
```

## 6. 성능 최적화 구현

### 6.1 Backend 최적화

#### 최적화 기법 6.1.1: 데이터베이스 연결 풀 튜닝
```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 20000
      idle-timeout: 300000
      max-lifetime: 1200000
```

#### 최적화 기법 6.1.2: JPA 최적화
```java
@Entity
@Table(name = "project")
@NamedEntityGraphs({
    @NamedEntityGraph(
        name = "Project.withTechStacks",
        attributeNodes = @NamedAttributeNode("techStacks")
    )
})
public class Project {
    // 엔티티 구현
}

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    @EntityGraph("Project.withTechStacks")
    Page<Project> findAll(Pageable pageable);
    
    @Query(value = "SELECT * FROM project WHERE MATCH(title, description) AGAINST(?1 IN NATURAL LANGUAGE MODE)", 
           nativeQuery = true)
    List<Project> findByFullTextSearch(String searchTerm);
}
```

### 6.2 Frontend 최적화

#### 최적화 기법 6.2.1: 코드 분할 및 지연 로딩
```typescript
// 라우트 레벨 코드 분할
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const AcademicsPage = lazy(() => import('./pages/AcademicsPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

#### 최적화 기법 6.2.2: 상태 관리 최적화
```typescript
// React Query 사용으로 캐싱 및 백그라운드 업데이트
const useProjects = (filters: ProjectFilters) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectApi.getProjects(filters),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

// 가상화로 대량 리스트 렌더링 최적화
import { FixedSizeList as List } from 'react-window';

const VirtualizedProjectList = ({ projects }) => (
  <List
    height={600}
    itemCount={projects.length}
    itemSize={120}
    itemData={projects}
  >
    {ProjectRow}
  </List>
);
```

## 7. 모니터링 및 성능 추적

### 7.1 실시간 모니터링

#### 모니터링 설정 7.1.1: Spring Boot Actuator
```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
```

#### 모니터링 설정 7.1.2: 커스텀 메트릭
```java
@Component
public class PerformanceMetrics {
    
    private final Counter apiRequestCounter;
    private final Timer apiResponseTimer;
    
    public PerformanceMetrics(MeterRegistry meterRegistry) {
        this.apiRequestCounter = Counter.builder("api.requests.total")
                .description("Total number of API requests")
                .register(meterRegistry);
                
        this.apiResponseTimer = Timer.builder("api.response.time")
                .description("API response time")
                .register(meterRegistry);
    }
    
    @EventListener
    public void handleRequest(RequestEvent event) {
        apiRequestCounter.increment();
        apiResponseTimer.record(event.getDuration(), TimeUnit.MILLISECONDS);
    }
}
```

### 7.2 성능 알림

#### 알림 설정 7.2.1: 임계값 기반 알림
```yaml
# 성능 임계값 정의
performance:
  thresholds:
    response-time: 500ms
    error-rate: 5%
    memory-usage: 80%
    cpu-usage: 70%
```

## 8. 성능 테스트 실행 계획

### 8.1 테스트 환경 준비

#### 환경 설정 체크리스트
```
□ Backend 서버 최적화 모드로 실행
□ Frontend 프로덕션 빌드 배포
□ 데이터베이스 테스트 데이터 준비
□ 모니터링 도구 설정
□ 네트워크 도구 설치 (ab, artillery)
□ 성능 측정 도구 준비
```

### 8.2 테스트 실행 순서

1. **기준선 측정** (Baseline)
   - 단일 사용자 성능 측정
   - 각 API 엔드포인트별 응답 시간
   - 메모리 및 CPU 사용량

2. **부하 테스트** (Load Testing)
   - 예상 사용자 수준의 부하
   - 지속적인 부하 하에서 성능 유지

3. **스트레스 테스트** (Stress Testing)  
   - 시스템 한계점 확인
   - 복구 능력 테스트

4. **최적화 적용**
   - 성능 병목점 해결
   - 코드 및 설정 최적화

5. **회귀 테스트** (Regression Testing)
   - 최적화 후 성능 재측정
   - 기능 정상 동작 확인

## 성능 테스트 결과 기록

| 테스트 유형 | 측정 항목 | 기준선 | 목표 | 실제 측정값 | 상태 | 개선 필요 |
|-------------|-----------|--------|------|-------------|------|-----------|
| 페이지 로드 | FCP | | < 1.5s | | | |
| 페이지 로드 | LCP | | < 2.5s | | | |
| API 응답 | GET /projects | | < 100ms | | | |
| API 응답 | GET /academics | | < 50ms | | | |
| 동시 요청 | 10명 사용자 | | < 200ms | | | |
| 메모리 사용 | 초기 힙 사용량 | | < 512MB | | | |
| 메모리 사용 | 1시간 후 증가량 | | < 20% | | | |

## 성능 최적화 우선순위

### 높은 우선순위 🔥
1. API 응답 시간 최적화
2. 데이터베이스 쿼리 성능 개선
3. Frontend 번들 크기 최적화
4. 이미지 및 정적 리소스 최적화

### 중간 우선순위 ⚡
1. 캐싱 전략 구현
2. 코드 분할 및 지연 로딩
3. 메모리 사용량 최적화
4. HTTP/2 및 압축 적용

### 낮은 우선순위 📈
1. CDN 도입 검토
2. 서버 사이드 렌더링 (SSR)
3. Progressive Web App (PWA) 기능
4. 고급 캐싱 전략 (Redis 등)

## 지속적 성능 모니터링

### 자동화된 성능 테스트
```bash
# CI/CD 파이프라인에 성능 테스트 통합
name: Performance Test
on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Performance Test
        run: |
          npm run build
          npm run start:prod &
          sleep 30
          artillery run performance-test.yml
          lighthouse http://localhost:3000 --output-path=./results
```

### 성능 대시보드
- 실시간 응답 시간 모니터링
- 에러율 추적
- 리소스 사용량 모니터링
- 사용자 경험 메트릭 (Core Web Vitals)

## 최종 검증 기준

✅ **응답 성능**: 모든 API 엔드포인트가 목표 응답 시간 달성  
✅ **사용자 경험**: Core Web Vitals 모든 항목이 Good 범위  
✅ **확장성**: 예상 사용자 수의 2배까지 안정적 처리  
✅ **리소스 효율성**: 메모리 및 CPU 사용량이 안정적 범위 유지  
✅ **지속가능성**: 성능 모니터링 및 알림 체계 구축 완료
