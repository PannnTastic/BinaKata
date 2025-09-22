`
# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Project overview
- Multi-service app for adaptive learning and dyslexia screening.
- Services:
  - frontend/ — Next.js (App Router, TypeScript, Tailwind). Includes server-side API routes and Prisma for DB access.
  - ml-service/ — FastAPI + TensorFlow CPU for risk scoring (/predict, /train).
  - db — PostgreSQL managed via docker-compose.
  - backend/ — FastAPI service (present, not wired into docker-compose by default).
- Orchestration: docker-compose.yml runs db, ml-service, and frontend as app.

Key environment variables
- DATABASE_URL: PostgreSQL connection string used by Prisma in frontend.
- JWT_SECRET: used by frontend auth utilities to sign/verify JWTs.
- ML_SERVICE_URL: base URL for the Python ML service (defaults to http://localhost:8001 if unset).

Common commands
- Run everything with Docker (recommended for local demo)
  ```sh
  docker compose up -d --build
  docker compose logs -f app   # follow frontend logs
  docker compose logs -f ml-service
  docker compose down -v       # stop and remove volumes (DB will be reset)
  ```

- Frontend (Next.js) development without Docker
  ```sh
  cd frontend
  npm install
  npm run dev        # starts Next.js dev server on :3000
  npm run lint       # Next.js ESLint
  npm run build      # production build
  npm run start      # start on :3000
  ```

- Prisma (DB schema/client)
  ```sh
  cd frontend
  npm run db:push    # prisma db push (applies schema to DATABASE_URL)
  npm run db:studio  # open Prisma Studio
  ```

- Backend (FastAPI) development without Docker (optional service)
  ```pwsh
  cd backend
  python -m venv .venv
  .venv/ScriptS/Activate.ps1
  pip install -r requirements.txt
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```

- ML service (FastAPI + TensorFlow) development without Docker (optional)
  ```sh
  cd ml-service
  pip install -r requirements.txt
  uvicorn main:app --host 0.0.0.0 --port 8001
  ```

Testing
- There are currently no test scripts configured in package.json and no test runners detected. If tests are added later, include how to run a single test here.

High-level architecture and data flow
- Frontend (Next.js App Router)
  - Location: frontend/src/app
  - Uses server Route Handlers under frontend/src/app/api for backend functionality, e.g.:
    - POST /api/auth/register and /api/auth/login — creates and verifies users, returns JWT access_token (see src/lib/auth.ts).
    - GET/POST /api/children — list/create child records for the authenticated parent.
    - POST /api/assessments/submit — computes per-item correctness, aggregates accuracy, optionally calls ML service for risk scoring, stores riskScore and recommendation.
  - Auth utilities (src/lib/auth.ts): bcrypt for password hashing; jsonwebtoken with JWT_SECRET for token issuance/verification.
  - DB access (src/lib/prisma.ts): singleton PrismaClient; Prisma schema in frontend/prisma/schema.prisma.
  - TypeScript path alias: @/* → src/* (see tsconfig.json).

- Data model (Prisma)
  - User — 1↔N Child
  - Child — 1↔N Assessment
  - Assessment — 1↔N AssessmentItem
  - AssessmentItem fields include itemType (letter|word|arrange), prompt, answer, isCorrect, position.

- ML service (FastAPI + TensorFlow)
  - Endpoints: / (health), /predict, /train.
  - /predict input: letters_accuracy, words_accuracy, arrange_accuracy, optional speech_accuracy, image_accuracy, avg_reaction_time.
  - Produces risk_score [0..1] and recommendation string.
  - On startup trains/loads a simple Keras model and persists to models/ within the container; dataset for training is models/dataset.jsonl.

- Orchestration (docker-compose.yml)
  - db: postgres:16 with volume db_data.
  - ml-service: builds from ml-service/, exposes :8001, volume model_data → /app/models.
  - app: builds from frontend/, sets DATABASE_URL, JWT_SECRET, ML_SERVICE_URL, depends on db and ml-service health, exposes :3000. Entry command is sh ./start.sh, which runs prisma db push and next start.

Notable paths
- Frontend: frontend/src/app (pages, API routes), frontend/src/lib (auth, prisma, api helpers), frontend/prisma/schema.prisma.
- ML service: ml-service/main.py, ml-service/requirements.txt, models/ persisted via docker volume.
- Compose: docker-compose.yml defines service wiring and env.

Operational tips specific to this repo
- If you change Prisma schema, re-run npm run db:push (or rebuild/start the app container which runs it on start).
- To point the frontend at a different ML URL in dev, set ML_SERVICE_URL in the environment before starting Next.js.
- The backend/ FastAPI service is present but not enabled in docker-compose; the frontend’s API routes implement the necessary endpoints for the current setup.
