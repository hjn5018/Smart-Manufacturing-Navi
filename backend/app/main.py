from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.mock_router import router as mock_router
import asyncio
from app.mock_systems.simulator import process_simulation

app = FastAPI(title="Smart Manufacturing Navi API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. Change to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Systems Router
app.include_router(mock_router, prefix="/api/mock", tags=["Mock Systems"])

@app.on_event("startup")
async def startup_event():
    # 서버 시작 시 백그라운드에서 실시간 시뮬레이션 태스크 실행
    asyncio.create_task(process_simulation())

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Manufacturing Navi API Server"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
