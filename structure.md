# 시스템 아키텍처 및 디렉토리 구조 (Structure)

## 1. 시스템 아키텍처 (System Architecture)
본 프로젝트는 가상의 제조 시스템을 모사하는 환경과, 이를 제어하는 AI 네비게이터로 구성됩니다.

- **Frontend (Web Dashboard & Voice Interface)**
  - UI/UX: React, Next.js 또는 Vue.js 기반 대시보드
  - 기능: 음성 입력(STT) / 출력(TTS) 컴포넌트, 가상 공정 상태 시각화(차트, 3D/2D 애니메이션).
- **Backend (API & Logic Server)**
  - Framework: Python FastAPI 또는 Node.js Express
  - 역할: Frontend와의 통신, 사용자 의도 분석 파이프라인 관리, 가상 산업 시스템 제어.
- **AI Core Engine**
  - LLM: 사용자 의도 파악 및 자연어 응답 생성 (OpenAI API 또는 로컬 LLM)
  - RAG / Ontology: Vector DB (ChromaDB, Pinecone 등)를 활용한 매뉴얼 및 과거 로그 검색, 공정 도메인 지식 그래프 연동.
- **Mock Industrial Systems (가상 공정 시스템)**
  - SCADA/PLC Mock: 실시간 센서 데이터(속도, 온도 등) 및 제어 로직 모사.
  - MES Mock: 생산 실적, 불량률, 공정 상태 모사.
  - ERP Mock: 자원 관리 및 전체 생산 계획 모사.

## 2. 디렉토리 구조 (예상)
```text
smart-manufacturing-navi/
├── frontend/                 # 웹 대시보드 및 음성 인터페이스
│   ├── public/
│   ├── src/
│   │   ├── components/       # 차트, 대시보드 카드, 마이크 버튼 등
│   │   ├── pages/            # 메인 모니터링 화면
│   │   ├── services/         # API 통신 (음성 전송, Mock 데이터 수신)
│   │   └── store/            # 상태 관리
├── backend/                  # 메인 백엔드 서버
│   ├── app/
│   │   ├── api/              # RESTful API 및 WebSocket 라우터
│   │   ├── core/             # 비즈니스 로직 및 설정
│   │   ├── llm_engine/       # 프롬프트, 의도 분석, RAG 파이프라인
│   │   ├── mock_systems/     # 가상 PLC, MES, SCADA, ERP 구현부
│   │   └── models/           # 데이터 모델 (Pydantic, SQLAlchemy 등)
├── ai_knowledge/             # AI 모델 및 데이터 
│   ├── ontology/             # 제조 공정 지식 그래프 데이터
│   ├── rag_docs/             # 가상 설비 매뉴얼, 과거 에러 로그 등 (PDF, TXT)
│   └── vector_db/            # 로컬 Vector DB 데이터
├── docs/                     # 문서 보관용 (PRD, 구조도 등 추가 가능)
├── prd.md
├── structure.md
└── task_list.md
```
