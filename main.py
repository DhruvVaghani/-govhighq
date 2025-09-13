from fastapi import FastAPI, Request
from pydantic import BaseModel
from Rag_model_TEST import run_llm  # Import your wrapper function
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
import os, re, traceback
import psycopg2
app = FastAPI()


from fastapi import HTTPException
import json, logging, traceback, uuid


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or replace with specific origin like ["http://localhost:5173"]
    allow_credentials=False,
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
# @app.post("/chat", response_model=ChatResponse)
# async def chat_endpoint(payload: ChatRequest):
#     try:
#         result = run_llm(payload.user_input, payload.thread_id)
#         return {"response": result}
#     except Exception as e:
#         return {"response": f"❌ Error: {str(e)}"}

#trying to debug the error
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    # Ensure strings (avoid None) and give thread_id a fallback
    user_input = str(payload.user_input or "")
    thread_id  = payload.thread_id or f"web-{uuid.uuid4()}"

    logging.info("INCOMING /chat payload: %s", json.dumps({"user_input": user_input[:200], "thread_id": thread_id}))

    try:
        result = run_llm(user_input=user_input, thread_id=thread_id)
        return {"response": result}
    except Exception as e:
        # PRINT FULL TRACE TO LOG STREAM
        logging.error("RUN_LLM FAILED:\n%s", traceback.format_exc())
        # Keep your simple JSON return for the UI
        return {"response": f"❌❌❌❌ Error: {e}"}


@app.get("/health/config-db")
def health_config_db():
    import os
    uri = os.getenv("SUPABASE_PG_CONN_STRING")
    return {"has_conn_string": bool(uri), "length": len(uri or 0)}

def _redact(uri: str) -> str:
    return re.sub(r'(postgresql://[^:]+:)([^@]+)(@)', r'\1***\3', uri or '')
        
@app.get("/db/ping")
def db_ping():
    uri = os.getenv("SUPABASE_PG_CONN_STRING")
    if not uri:
        raise HTTPException(500, "SUPABASE_PG_CONN_STRING not set")

    # Supabase always requires SSL
    if "sslmode=" not in uri:
        uri = uri + ("&" if "?" in uri else "?") + "sslmode=require"

    try:
        conn = psycopg2.connect(uri)
        cur = conn.cursor()
        cur.execute("select 1;")
        row = cur.fetchone()
        cur.close()
        conn.close()
        return {"ok": True, "row": row}
    except Exception as e:
        print("DB connect failed:\n", traceback.format_exc())
        raise HTTPException(500, f"DB connect failed: {e}; uri={_redact(uri)}")

    
#push to testt
