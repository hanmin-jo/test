# Study Backend (FastAPI + SQLAlchemy + MySQL)

## 개요

이 프로젝트는 **FastAPI**, **SQLAlchemy**, **MySQL**을 사용하는 학습 서비스용 백엔드 기본 뼈대입니다.

구성 파일:
- `main.py` : FastAPI 앱 및 Health Check (`GET /`)
- `database.py` : MySQL 연결 및 세션/베이스 설정, `.env` 로드
- `models.py` : `User`, `Note`, `Quiz`, `StudyRecord` ORM 모델 및 관계 정의
- `requirements.txt` : 필요한 파이썬 패키지 목록

## 환경 변수 설정 (.env)

프로젝트 루트(`main.py`와 같은 위치)에 `.env` 파일을 생성하고 아래와 같이 설정하세요.

```bash
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=study_db
```

## 의존성 설치

```bash
pip install -r requirements.txt
```

## 개발 서버 실행

```bash
uvicorn main:app --reload
```

브라우저에서 아래 주소로 접속하여 Health Check를 확인할 수 있습니다.

- `http://127.0.0.1:8000/` : `{ "status": "ok" }` 응답
- `http://127.0.0.1:8000/docs` : 자동 생성된 Swagger UI

