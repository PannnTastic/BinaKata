# BinaKata

Solusi pembelajaran adaptif bagi anak penyandang disleksia. Stack:
- Frontend: Next.js (App Router) + Tailwind CSS
- Backend: FastAPI + TensorFlow (CPU) + SQLModel + PostgreSQL
- Infra: Docker Compose

## Jalankan secara lokal (Docker)
1. Salin env (opsional):
   - JWT_SECRET di docker-compose.yml bisa diganti.
2. Build & run:
   ```
   docker compose up -d --build
   ```
3. Akses:
   - Frontend: http://localhost:3000
   - Backend API docs: http://localhost:8000/docs

## Alur Fitur (sesuai mockup PDF)
- Landing, Register/Login
- Tes Skrining (huruf, kata, menyusun huruf)
- Hasil Tes + Rekomendasi
- Dashboard & Progress (kalender konsistensi)

## Pengembangan lokal tanpa Docker
- Frontend: `cd frontend && npm install && npm run dev`
- Backend: `cd backend && python -m venv .venv && .venv/Scripts/Activate.ps1 && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- Jalankan PostgreSQL lokal dan set `DATABASE_URL`