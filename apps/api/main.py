from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ScaffAI API", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番では適切なドメインに制限
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ScaffAI API Server"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/calculate")
async def calculate_scaffold(data: dict):
    # 足場計算ロジック（後で実装）
    return {"result": "calculation completed", "data": data}
