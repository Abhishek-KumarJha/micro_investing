<div align="center">
  <h1>🚀 AI-Powered Micro-Investing Platform</h1>
  <p>
    <strong>A smart, automated, and predictive micro-investing ecosystem built for the modern investor.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>
</div>

<hr />

## 📖 Overview

The **AI-Based Micro-Investing Assistant** is a production-grade financial platform designed to make investing accessible to everyone. By analyzing daily transactions, the platform automatically calculates "spare change" round-offs and intelligently invests them into diversified portfolios. 

At its core, the platform leverages advanced Deep Learning algorithms (PyTorch) to analyze behavioral data, calculate risk tolerance, and provide personalized asset recommendations tailored to individual financial goals.

---

## ✨ Key Features

- **🧠 Intelligent Behavioral Data Processing**: Ingests CSV-based transaction data and automatically calculates round-offs for seamless spare change investing.
- **🎯 Dynamic Risk Profiling**: Utilizes both user questionnaires and ML-based inference to accurately determine an individual's financial risk appetite.
- **📈 Hybrid Recommendation Engine (DLHR)**: A sophisticated neural network model built with PyTorch that suggests optimal asset allocations (e.g., Equities, Bonds, Mutual Funds, ETFs).
- **💸 Simulated Execution & Tracking**: A beautifully designed, layman-accessible dashboard for tracking potential micro-investments, budget calculations, and long-term wealth projections.
- **🎨 Stunning UI/UX**: Built with a sleek Glassmorphism design system on top of Next.js and Tailwind CSS, providing a premium feel.
- **🔒 Secure & Scalable**: FastAPI backend with JWT authentication, backed by a robust PostgreSQL database.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 14, React
- **Styling**: Tailwind CSS, Glassmorphism UI patterns
- **Data Fetching**: SWR / Axios

### Backend
- **API Framework**: FastAPI (Python 3.10+)
- **ORM & Database**: SQLAlchemy, PostgreSQL, Redis (Caching/Tasks)
- **Authentication**: JWT (JSON Web Tokens)
- **AI/ML Layer**: PyTorch (for DLHR / Risk models), Gemini API (for predictive analytics)

### DevOps & Deployment
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

---

## 📂 Project Structure

```text
├── backend/                  # FastAPI backend and ML models
│   ├── app/                  # Main application code (API, ML, DB, Schemas)
│   ├── scripts/              # Utility scripts (e.g., data generation)
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend container definition
├── frontend/                 # Next.js frontend application
│   ├── src/                  # React components, pages, and styles
│   ├── package.json          # Node.js dependencies
│   └── Dockerfile            # Frontend container definition
├── aggressive_spending.csv   # Sample dataset
├── conservative_spending.csv # Sample dataset
├── docker-compose.yml        # Multi-container orchestration
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Node.js](https://nodejs.org/) (for local frontend development)
- [Python 3.10+](https://www.python.org/downloads/) (for local backend development)

### Running with Docker (Recommended for Production/Testing)

The easiest way to spin up the entire stack is using Docker Compose.

```bash
docker-compose up --build
```

Once the containers are running, access the services at:
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Swagger API Docs**: [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

---

### Local Development Setup

If you prefer to run the services individually for development purposes:

#### 1. Backend (FastAPI)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run mock data generation (Requires running PostgreSQL)
python scripts/generate_data.py

# Start the server
uvicorn app.main:app --reload
```

#### 2. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🛠️ CI/CD & Deployment

This repository includes a pre-configured GitHub Actions workflow located at `.github/workflows/deploy.yml`. It handles backend dependency installation and basic checks.

### Deploying the Frontend to Vercel

Vercel is the recommended platform for hosting the Next.js frontend. Follow these steps to deploy:

1. **Push your code to GitHub**: Ensure your `frontend` folder is committed and pushed to a GitHub repository.
2. **Create a Vercel Account**: Sign up or log in to [Vercel](https://vercel.com/).
3. **Import Project**: Click "Add New..." -> "Project" and select your GitHub repository.
4. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (Important: Click Edit next to Root Directory and select the `frontend` folder).
5. **Environment Variables**: Add your backend API URL so the frontend knows where to fetch data.
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-production-backend-url.com` (Replace with your actual backend URL, e.g., from Render/Railway).
6. **Deploy**: Click the **Deploy** button. Vercel will automatically build and deploy your Next.js application.

### Deploying the Backend to Render (Layman's Guide)

Since your backend uses Python, AI models, and a database, [Render.com](https://render.com/) is one of the easiest places to host it for free/cheap.

#### Step 1: Setup the Database
1. Create an account on Render.
2. Click **New +** at the top right and select **PostgreSQL**.
3. Give your database a name (e.g., `micro-investing-db`) and click **Create Database**.
4. Once created, scroll down to the **Connections** section and copy the **Internal Database URL**. Keep this safe!

#### Step 2: Deploy the FastAPI App
1. Click **New +** again and select **Web Service**.
2. Connect your GitHub account and select your project repository.
3. In the setup page, configure the following:
   - **Name**: Give it a name (e.g., `micro-investing-api`).
   - **Root Directory**: Type exactly `backend` (this tells Render where the Python code lives).
   - **Environment**: Select `Python 3`.
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**: Scroll down and click "Add Environment Variable". You need to add:
   - Key: `DATABASE_URL` | Value: *(Paste the Internal Database URL you copied earlier)*
   - Key: `GEMINI_API_KEY` | Value: *(Your Google Gemini API Key)*
5. Scroll to the bottom and click **Create Web Service**. 

Render will now install your Python packages and start the server! Once it's live, copy the new Render web address (e.g., `https://micro-investing-api.onrender.com`) and paste it into your Vercel frontend settings under `NEXT_PUBLIC_API_URL`.

---

### Alternative Database: Setting up MongoDB Atlas (Layman's Guide)

*(Note: The project currently defaults to PostgreSQL. Follow these steps only if you are customizing the backend to use MongoDB instead.)*

If you prefer to use a NoSQL database like MongoDB, **MongoDB Atlas** is the best free cloud provider.

#### Step 1: Create a MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Build a Database** and select the **M0 FREE** shared cluster.
3. Choose your preferred cloud provider (e.g., AWS) and region, then click **Create Cluster**.

#### Step 2: Configure Security and Access
1. **Create a User**: Under "Security Quickstart", create a database user with a **Username** and **Password**. *(Save the password somewhere safe!)*
2. **Network Access**: Scroll down to "IP Access List" and click **Add My Current IP Address**, or to allow access from anywhere (like Vercel/Render), type `0.0.0.0/0` and click Add.
3. Click **Finish and Close**.

#### Step 3: Get Your Connection URL
1. Go back to your Database dashboard and click the **Connect** button next to your cluster.
2. Choose **Connect your application** (Drivers).
3. Copy the **Connection String** provided. It will look something like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
4. Replace `<username>` and `<password>` with the credentials you created in Step 2.
5. You can now use this URL as your `DATABASE_URL` environment variable!

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
<div align="center">
  <i>Built with ❤️ for the future of finance.</i>
</div>
