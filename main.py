from fastapi import FastAPI, Request
from pydantic import BaseModel
from Rag_model_TEST import run_llm  # Import your wrapper function
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or replace with specific origin like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel


# Request model - what the frontend will send
class ChatRequest(BaseModel):
    user_input: str
    thread_id: str


# Response model - what this API will return
class ChatResponse(BaseModel):
    response: str  # ✅ Just one string field, matching your return value


# 5. Expose LLM via /chat POST endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    try:
        result = run_llm(payload.user_input, payload.thread_id)
        return {"response": result}
    except Exception as e:
        return {"response": f"❌ Error: {str(e)}"}
@app.get("/health/config-db")
def health_config_db():
    import os
    uri = os.getenv("SUPABASE_PG_CONN_STRING")
    return {"has_conn_string": bool(uri), "length": len(uri or 0)}

        
@app.get("/db/ping")
def db_ping():
    uri = os.getenv("SUPABASE_PG_CONN_STRING")
    if not uri:
        raise HTTPException(500, "SUPABASE_PG_CONN_STRING not set")
    try:
        with psycopg2.connect(uri) as conn:
            with conn.cursor() as cur:
                cur.execute("select 1;")
                return {"ok": True}
    except Exception as e:
        raise HTTPException(500, f"DB connect failed: {e}")

    
#push to test
