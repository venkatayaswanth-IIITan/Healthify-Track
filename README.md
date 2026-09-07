# 🏥 HealthTrack — Full Stack Healthcare Platform

A modern, AI-powered full-stack health and wellness tracking platform built with **React (TypeScript + Vite + Tailwind CSS)** and **Node.js (Express + MongoDB)**.

---

## 📁 Clean Project Structure

```
OLABS-HACKATHON-HEALTH-CARE-PROJECT/
├── client/                     # 🎨 Frontend Web Application (React + Vite)
│   ├── src/
│   │   ├── components/         # Modular React components
│   │   │   ├── ChatBot.tsx     # MEDICO AI ChatBot (Google Gemini / OpenRouter)
│   │   │   ├── Dashboard.tsx   # Health metrics & daily summary
│   │   │   ├── DietPlan.tsx    # Budget & Calorie Diet Plan Generator
│   │   │   ├── Goals.tsx       # Interactive health goals tracker
│   │   │   ├── Profile.tsx     # User metrics, BMI calculation & dark mode
│   │   │   ├── Rewards.tsx     # Gamified rewards redemption
│   │   │   ├── Scanner.tsx     # Live camera food nutrition scanner
│   │   │   ├── StepCounter.tsx # Live step counter & 7-day progress
│   │   │   └── EmergencySOSButton.tsx # Emergency SOS quick-action
│   │   ├── App.tsx             # Root routing and auth state
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Tailwind design tokens
│   ├── vercel.json             # Vercel deployment configuration (SPA routing)
│   ├── package.json            # Frontend dependencies
│   └── .env.example            # Client environment variables template
│
├── server/                     # ⚙️ Backend API Server (Node.js + Express + MongoDB)
│   ├── models/
│   │   └── User.js             # Mongoose User & Profile Schema
│   ├── routes/
│   │   ├── authRoutes.js       # Signup & Login API endpoints
│   │   └── aiRoutes.js         # MEDICO AI proxy endpoint
│   ├── server.js               # Express application with CORS & health check
│   ├── render.yaml             # Render deployment blueprint
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Server environment variables template
│
├── package.json                # Unified monorepo scripts
├── .gitignore                  # Global Git ignore rules
└── README.md                   # Documentation & Deployment Guide
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (bundled with Node.js)

### 2. Install Dependencies

Install all dependencies for both frontend and backend:
```bash
# In the root repository directory:
npm run install:all

# Or separately:
cd client && npm install
cd ../server && npm install
```

### 3. Run Locally

#### Start Frontend (Client)
```bash
cd client
npm run dev
```
> The web app will be live at: **`http://localhost:5173`**

#### Start Backend (Server)
```bash
cd server
npm run dev
```
> The API server will be live at: **`http://localhost:5000`**
> API Health check: **`http://localhost:5000/api/health`**

---

## 🌐 Deploy to Vercel (Frontend)

The frontend is ready for **1-click deployment on [Vercel](https://vercel.com/)**:

1. Log in to [Vercel Dashboard](https://vercel.com/) and click **"Add New Project"**.
2. Import your GitHub repository: `OLABS-HACKATHON-HEALTH-CARE-PROJECT`.
3. In the project settings:
   - **Root Directory**: Select `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables** in Vercel:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com` (your deployed backend URL)
   - `VITE_OPENROUTER_KEY`: *(Optional)* Your OpenRouter API key
5. Click **Deploy**. Vercel will automatically build and host your application with global CDN caching and SSL.

---

## ⚡ Deploy to Render (Backend)

The backend is configured for **[Render](https://render.com/) Web Service**:

1. Log in to [Render Dashboard](https://dashboard.render.com/) and click **"New Web Service"**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In the **Environment Variables** tab, add:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/healthtracker?retryWrites=true&w=majority` (or MongoDB Atlas connection string)
   - `CLIENT_ORIGIN`: `https://your-frontend.vercel.app` (your Vercel frontend URL)
   - `OPENROUTER_API_KEY`: *(Optional)* Your OpenRouter API key
5. Click **Create Web Service**. Render will deploy the API and assign an HTTPS endpoint.

---

## ✨ Features

- 🤖 **MEDICO AI ChatBot**: Embedded interactive AI health assistant powered by Google Gemini & OpenRouter.
- 🥗 **Smart Diet Plan Generator**: Automatic meal plan calculation based on daily budget and calorie targets.
- 📷 **Live Food Scanner**: Nutrition recognition with live camera stream for calorie and protein computation.
- 🚶 **Step Counter & History**: Step goal tracking with weekly average statistics.
- 🎯 **Gamified Goals & Rewards**: Earn points for completing daily health goals and redeem exclusive rewards.
- 🚨 **Emergency SOS Button**: One-tap emergency alert trigger.
- 👤 **Health Profile & BMI**: Live BMI calculation with weight management indicators and Dark Mode support.

---

## 📜 License
This project is licensed under the MIT License.
