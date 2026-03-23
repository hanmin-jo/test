# Smart Note AI v2.0

AI 기반 학습 보조 서비스 — Phase 1~3 개선 완료 버전

## 변경 사항 요약

### Phase 1 — 버그 수정
- Mock 퀴즈 제거 → Gemini 실제 퀴즈 생성 연동
- `NoteResponse`에 `created_at`, `updated_at`, `category` 필드 추가
- `answer` 포맷 통일 (정수 인덱스로 일원화)
- `requirements.txt` 정리 (OpenAI 제거, 실제 패키지 추가)
- OpenAI 관련 데드 코드 전부 제거
- API URL → `VITE_API_BASE_URL` 환경변수로 통합

### Phase 2 — 인증 구현
- `POST /api/auth/register` — 회원가입 + JWT 발급
- `POST /api/auth/login` — 로그인 + JWT 발급
- `GET /api/auth/me` — 현재 사용자 조회
- `AuthContext` — 전역 로그인 상태 관리 (localStorage 토큰)
- `ProtectedRoute` — 비로그인 시 /login 리다이렉트
- 모든 API 엔드포인트에 `current_user` 의존성 주입
- 로그인/회원가입 실제 API 연동, 사용자 이름 동적 표시
- `startup` → `lifespan` 마이그레이션

### Phase 3 — 기능 완성
- `Note` 모델에 `category` 컬럼 추가
- `DELETE /api/notes/{id}` — 노트 삭제
- `GET /api/notes?search=&category=` — 검색 + 카테고리 필터
- `GET /api/notes/categories` — 사용자 카테고리 목록
- `GET /api/notes/{id}/quizzes` — 노트별 저장 퀴즈 조회
- `POST /api/notes/{id}/regenerate-quiz` — 퀴즈 재생성
- `POST /api/study-records/batch` — 퀴즈 결과 일괄 저장
- `GET /api/dashboard/stats` — 실제 통계 (총 노트, 퀴즈, 평균 점수, 오늘 활동)
- `GET /api/dashboard/recent-notes` — 최근 노트 3개
- `ToastContext` — `alert()` 전면 교체, 전역 토스트 알림
- NoteList 검색(디바운스) / 카테고리 드롭다운 / 삭제 버튼
- QuizPage — DB 저장 퀴즈 로드, 채점 후 StudyRecord 저장
- Dashboard — API 통계 실시간 연동

---

## 실행 방법

### 백엔드

```bash
cd backend

# 1) .env 파일 생성
cp .env.example .env
# .env에서 GEMINI_API_KEY, SECRET_KEY 값 설정

# 2) 패키지 설치
pip install -r requirements.txt

# 3) 실행
python main.py
# → http://localhost:8000
```

### 프론트엔드

```bash
cd frontend

# 1) 패키지 설치
npm install

# 2) 환경변수 확인 (.env 이미 존재)
# VITE_API_BASE_URL=http://localhost:8000

# 3) 실행
npm run dev
# → http://localhost:5173
```

---

## API 목록

| Method | Path | 인증 | 설명 |
|--------|------|------|------|
| POST | /api/auth/register | ✗ | 회원가입 |
| POST | /api/auth/login | ✗ | 로그인 |
| GET | /api/auth/me | ✓ | 내 정보 |
| POST | /api/notes/ | ✓ | 노트 생성 + AI 퀴즈 자동 생성 |
| GET | /api/notes | ✓ | 노트 목록 (검색/필터) |
| GET | /api/notes/{id} | ✓ | 노트 상세 |
| PATCH | /api/notes/{id} | ✓ | 노트 수정 |
| DELETE | /api/notes/{id} | ✓ | 노트 삭제 |
| GET | /api/notes/categories | ✓ | 카테고리 목록 |
| GET | /api/notes/{id}/quizzes | ✓ | 노트별 퀴즈 조회 |
| POST | /api/notes/{id}/regenerate-quiz | ✓ | 퀴즈 재생성 |
| POST | /api/summary | ✓ | AI 요약 |
| POST | /api/quiz | ✓ | AI 퀴즈 미리보기 |
| POST | /api/study-records/batch | ✓ | 학습 기록 저장 |
| GET | /api/dashboard/stats | ✓ | 대시보드 통계 |
| GET | /api/dashboard/recent-notes | ✓ | 최근 노트 3개 |
