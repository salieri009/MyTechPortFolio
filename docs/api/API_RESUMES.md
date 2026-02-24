# API: 이력서 (Resumes)

Base Path: `/api/v1/resumes`

---

## GET `/resumes`
이력서 목록 조회 (Public)
- 응답: 모든 활성 이력서 버전 목록
  - 각 항목: id, version, title, description, fileName, fileType, fileSize, isActive, isPublic, downloadCount

## GET `/resumes/primary`
기본 활성 이력서 조회 (Public)
- 응답: isActive=true인 대표 이력서

## GET `/resumes/{id}/download`
이력서 다운로드 (Public)
- 응답: 파일 바이너리 (Content-Disposition: attachment)
- 자동 처리: downloadCount 증가, lastDownloadedAt 업데이트

## GET `/resumes/statistics`
다운로드 통계 (ADMIN)
- 응답: 버전별 다운로드 수, 총 다운로드 수, 마지막 다운로드 일시
