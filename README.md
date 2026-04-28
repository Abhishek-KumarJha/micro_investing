# AI-Based Micro-Investing Assistant

## Overview
This is a fully functional, production-grade AI micro-investing platform built with Next.js, FastAPI, PostgreSQL, and PyTorch (for DLHR / Risk models).

## Features
- **Behavioral Data Processing**: Automatically calculates round-offs for spare change investing.
- **Risk Profiling**: Questionnaire and ML-based inference.
- **Hybrid Recommendation Engine (DLHR)**: Neural network-based asset recommendation.
- **Simulated Execution**: Dashboard for tracking potential micro-investments.

## Architecture
- **Frontend**: Next.js 14, React, Tailwind CSS, Glassmorphism UI
- **Backend**: FastAPI, SQLAlchemy, JWT Authentication
- **Database**: PostgreSQL, Redis
- **AI/ML Layer**: PyTorch

## Deployment Instructions

### Prerequisites
- Docker & Docker Compose
- Node.js (for local frontend dev)
- Python 3.10+ (for local backend dev)

### Running with Docker Compose (Production-like)
```bash
docker-compose up --build
```
The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/api/v1/openapi.json

### Running Locally (Development)

#### Backend
1. Create a virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Run mock data generation (Ensure PostgreSQL is running on localhost):
```bash
python scripts/generate_data.py
```
4. Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

#### Frontend
1. Install dependencies:
```bash
cd frontend
npm install
```
2. Start the dev server:
```bash
npm run dev
```

## CI/CD
A GitHub Actions workflow is included in `.github/workflows/deploy.yml` which installs backend dependencies and is ready to be expanded for Vercel/AWS deployment.
