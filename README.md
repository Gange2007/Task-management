# TaskFlow — Full-Stack Task Management Application

A modern, production-ready task management web application built with Next.js, Express.js, and MongoDB.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Drag & Drop | @hello-pangea/dnd |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| Real-time | Socket.io |
| Icons | Lucide React |

---

## 📁 Project Structure

```
taskflow/
├── frontend/          # Next.js application
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── login/page.tsx              # Login
│   │   ├── register/page.tsx           # Register
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Dashboard overview
│   │   │   ├── tasks/page.tsx          # Task management
│   │   │   ├── kanban/page.tsx         # Kanban board
│   │   │   └── settings/page.tsx       # Profile settings
│   │   ├── components/
│   │   │   ├── dashboard/              # Dashboard components
│   │   │   ├── tasks/                  # Task components
│   │   │   └── ui/                     # Shared UI
│   │   ├── context/                    # React context
│   │   ├── lib/                        # API client
│   │   └── types/                      # TypeScript types
│   └── .env.local
│
└── backend/           # Express API
    ├── src/
    │   ├── server.js
    │   ├── models/         # Mongoose models
    │   ├── controllers/    # Route handlers
    │   ├── routes/         # Express routes
    │   ├── middleware/      # Auth middleware
    │   └── utils/
    └── .env
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/profile` | Get current user |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks (with filters) |
| GET | `/api/tasks/stats` | Get task statistics |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Users (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/change-password` | Change password |

---

## ✨ Features

- **Landing Page** — Hero, features, how it works, CTA
- **Authentication** — Register/Login with JWT, password strength meter
- **Dashboard** — Stats cards, bar chart, pie chart, recent tasks
- **Task Management** — CRUD with priority, category, due date, status
- **Kanban Board** — Drag & drop between Pending / In Progress / Completed
- **Search & Filter** — By title, priority, status; sort by date/priority
- **Real-Time Updates** — Socket.io live sync
- **Settings** — Profile edit, photo upload, password change
- **Dark Mode** — Full light/dark theme toggle
- **Responsive** — Mobile, tablet, desktop

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
# Push to GitHub, connect repo in Vercel
# Set environment variables in Vercel dashboard
```

### Backend → Railway / Render
```bash
cd backend
# Push to GitHub, connect repo in Railway/Render
# Set environment variables in dashboard
```

### Database → MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get connection string and set `MONGODB_URI` in backend env
## Live Demo

## Live Demo

Frontend:
https://task-management-x35n-cpsccts54-gange2007s-projects.vercel.app

Backend API:
https://task-management-1-li5y.onrender.com/api/health
