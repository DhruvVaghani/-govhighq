🚀 GovHighQ – LLM-Powered Internal Research Assistant

GovHighQ is a secure, AI‑driven research assistant built for CoSolutions analysts. It integrates a FastAPI backend powered by Azure OpenAI, Azure Cognitive Search, and Supabase memory with a React + Vite frontend deployed on Azure Static Web Apps.

📌 Features

🔐 Supabase Authentication — Email login, JWT validation, secure user sessions

🤖 RAG Chatbot — LangChain + LangGraph pipeline using GPT‑4o

📄 Document Processing — PDF/DOCX ingestion, chunking, and embedding into Azure Cognitive Search

🧠 Chat Memory — Turn‑based history stored in Supabase PostgreSQL

☁️ Azure Cloud Deployment — Static Web Apps (frontend) + App Service (backend)

🔄 CI/CD Automation — GitHub Actions builds & deploys both frontend and backend

⚙️ Prerequisites

Ensure the following tools are installed:

Tool / Platform	Required Version
Python	3.10+
Node.js + npm	Node 18+
Git	Latest
Supabase	Auth + Postgres DB
Azure Services	OpenAI, Cognitive Search, Blob Storage, App Service, Static Web Apps
🔽 Clone the Repository
git clone https://github.com/<your-org>/-govhighq.git
cd -govhighq

🐍 Backend Setup (FastAPI)
1️⃣ Create Virtual Environment

Windows PowerShell

py -3 -m venv rag_env
.\rag_env\Scripts\Activate.ps1


Mac/Linux

python3 -m venv rag_env
source rag_env/bin/activate

2️⃣ Install Dependencies
pip install -r rag_requirements_TEST.txt

🌐 Frontend Setup (React + Vite)
cd frontend
npm install
