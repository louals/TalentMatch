# TalentMatch 🎯
> **AI-Powered Job Matching Platform** connecting candidates and employers with automated CV parsing, intelligent job-matching algorithms, and instant cover letter generation.

---

## 🏗️ Repository Architecture

This repository is organized as a unified monorepo housing the entire TalentMatch ecosystem:

```text
TalentMatch/
├── backend/            # FastAPI Python backend & AI services
│   ├── app/            # Routers, CRUD, models, schemas, and AI matching
│   ├── migrations/     # Alembic database migrations
│   ├── Dockerfile      # Backend container definition
│   └── requirements.txt# Python dependencies
│
├── frontend/           # Web application (React 18, Vite, Tailwind CSS)
│   ├── src/            # Pages, components, contexts (Candidate, Employer, Admin)
│   └── package.json    # Frontend dependencies and scripts
│
├── mobile/             # Cross-platform mobile app (React Native)
│   ├── android/        # Android native project
│   ├── ios/            # iOS native project
│   ├── src/            # Mobile screens and navigation
│   └── package.json    # React Native dependencies and scripts
│
├── docs/               # Architecture diagrams, UML, database schemas, user stories
├── docker-compose.yml  # Root compose for Backend + PostgreSQL + MongoDB
├── .env.example        # Environment variables template
└── .gitignore          # Master ignore rules for Python, Node, iOS, Android
```

---

## ⚡ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy (asyncpg), Alembic, Pydantic |
| **Databases** | PostgreSQL (Relational/User & Job data), MongoDB (Unstructured CV & Match data) |
| **AI / NLP** | OpenAI GPT API (CV extraction, matching engine, cover letter generation) |
| **Web Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion |
| **Mobile App** | React Native 0.80+, TypeScript, React Navigation, iOS & Android |
| **DevOps** | Docker, Docker Compose |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Docker & Docker Compose](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (v18+) and npm
- [Python 3.11+](https://www.python.org/)

---

### 2. Setting Up the Environment Variables
Copy `.env.example` to `.env` in the `backend/` folder (or at root):
```bash
cp .env.example backend/.env
```
Update `backend/.env` with your actual database URLs and API keys (OpenAI, Google OAuth).

---

### 3. Running with Docker Compose (Recommended)
You can start PostgreSQL, MongoDB, and the FastAPI backend with a single command:
```bash
docker compose up -d
```
- **Backend API:** `http://localhost:8000`
- **Interactive API Docs (Swagger):** `http://localhost:8000/docs`

---

### 4. Running the Web Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173` in your browser.

---

### 5. Running the Mobile App
In a new terminal:
```bash
cd mobile
npm install

# Start Metro Bundler
npm start

# Run on Android or iOS
npm run android
# or
npm run ios
```

---

## 📚 Documentation

For in-depth architectural and database specifications, check the [`docs/`](./docs) directory:
- [System Architecture](./docs/architecture.md)
- [PostgreSQL ER Diagram](./docs/er_postgresql.md)
- [MongoDB Schema](./docs/mongodb_schema.md)
- [User Roles & Permissions](./docs/roles.md)
- [User Stories](./docs/user_stories.md)
- [UML Diagram](./docs/UML.pdf)

---

## 🔒 Security Note
Never commit `.env` files or API secrets to version control. Always duplicate `.env.example` locally and configure secrets through environment variables or secret managers in production.
