# GovHighQ Platform

GovHighQ is an internal research companion for CoSolutions analysts. It couples a Supabase-secured FastAPI backend (media pipeline, data scrapers, RAG chatbot) with a React + Vite front end that provides the GovHighQ workspace UI, chat surface, and credentialed access flow.

## Repository Map

```
backend/                        FastAPI app (auth, scrapers, media ingestion, RAG chatbot, Azure integrations)
frontend/                       Vite + React (TypeScript) client with Supabase Auth and chatbot UX
automation/                     Standalone scraping utilities and scripts
data/                           Static seed artifacts (e.g., SAM opportunity exports)
docs/                           Additional documentation (deployment guide, future notes)
.github/workflows               CI pipelines for backend/frontend/automation
.env.example                    Backend environment template
frontend/.env.local.example     Frontend Vite environment template
```

### Key Components
- **Supabase authentication**: Backend validates Supabase-issued JWTs; frontend handles login, logout, and token refresh.
- **Media + scraper services** (`backend/api/media`, `backend/api/scrapers`): Fetch, normalize, and expose federal opportunity data plus uploaded media stored in Azure Blob Storage.
- **Chatbot stack** (`backend/api/chatbot`): LangChain/LangGraph-backed RAG model hosted behind `/chatbot/chat`, using Azure OpenAI and Azure Cognitive Search plus Supabase for chat history.
- **Brand-aware UI** (`frontend/src`): Navigation bar, login page, and workspace cards use assets from `frontend/branding/` (light/dark logos, CoSolutions branding).

## Prerequisites

| Area        | macOS / Linux                          | Windows (PowerShell)                         |
|-------------|----------------------------------------|---------------------------------------------|
| Python      | `python3` ≥ 3.10, `pip`                | `py -3` ≥ 3.10, `pip`                        |
| Node / npm  | Node 18+ (LTS recommended)             | Install Node 18+ via Node.js installer       |
| Tooling     | Git, make sure OpenSSL is available    | Git for Windows, Visual C++ Build Tools (for psycopg2) |

> **Tip:** On Windows, run PowerShell with *Run as Administrator* the first time you install dependencies to allow script execution (`Set-ExecutionPolicy RemoteSigned` may be required for venv activation).

## Environment Configuration

1. Duplicate the shared environment file and fill in secrets:

   ```bash
   cp .env.example .env
   ```

   Required values include Supabase keys, Azure Storage + OpenAI credentials, and chatbot search settings (see `backend/config.py` for the full list).

2. Create the frontend environment file (`frontend/.env.local`) so Vite can expose API targets to the browser:

   ```bash
   cat <<'EOF' > frontend/.env.local
   VITE_API_BASE_URL=http://localhost:8000
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   EOF
   ```

   On Windows PowerShell:

   ```powershell
   @"
   VITE_API_BASE_URL=http://localhost:8000
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   "@ | Out-File -FilePath frontend/.env.local -Encoding utf8
   ```

## Dependency Installation

### macOS / Linux
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

npm install --prefix frontend
```

### Windows (PowerShell)
```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt

npm install --prefix frontend
```

The root `package.json` also exposes helper scripts (`npm run dev:frontend`, `npm run build:frontend`, etc.) that simply proxy into `frontend/`.

## Running Locally

### Backend (FastAPI)
1. Open a terminal at the repo root.
2. Activate your virtual environment (see install section above).
3. Run the backend server:
   ```bash
   uvicorn backend.main:app --reload
   ```
4. The API listens on `http://localhost:8000` (health check: `GET /health`).

### Frontend (Vite Dev Server)
1. Open a second terminal at the repo root.
2. Start the Vite dev server pointing at the `frontend` folder:
   ```bash
   npm --prefix frontend run dev
   ```
3. Visit `http://localhost:5173`. The app will automatically call the backend using `VITE_API_BASE_URL`.

## Building for Production

```bash
# Frontend bundle (outputs to frontend/dist)
npm --prefix frontend run build

# Backend doesn't have a build step; ensure dependencies are installed and run via uvicorn/gunicorn
```

The frontend build script directly invokes local binaries (`node ./node_modules/...`) to avoid npm shim issues encountered on some macOS setups.

## Additional Documentation

- Deployment Guide: `docs/DEPLOYMENT.md`

## CI / Automation

- `.github/workflows/frontend-build.yml`: Installs Node deps, runs `npm run build:frontend`, and uploads the Vite `dist/` artifact.
- `.github/workflows/backend-deploy.yml`: Installs Python deps and runs `python -m compileall` as a lightweight sanity check. Extend with deployment steps (Azure App Service, Container Apps) as needed.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `tsc: command not found` on macOS | Scripts already call `node ./node_modules/typescript/bin/tsc`; ensure `npm install --prefix frontend` succeeded. |
| `psycopg2` compilation errors on Windows | Install *Desktop development with C++* workload (Visual Studio Build Tools) or use `pip install psycopg[binary]` from requirements. |
| 401 responses from API | Verify Supabase keys in `.env` and that the frontend is pointing to the same project (`VITE_SUPABASE_URL`). |

## Additional Notes

- All static branding assets live in `frontend/branding/` and are imported directly in components (navbar, login page) for reliable bundling.
- Azure Blob Storage connection string + container drive the media ingestion flow (`backend/api/media`).
- The RAG chatbot relies on Azure OpenAI + Azure Cognitive Search. Ensure their keys/index names are populated before enabling the chat panel in production.

Happy shipping!
