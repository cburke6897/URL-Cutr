# URL-Cutr 🔗✂️

> ⚠️ **Work in Progress** — This project is actively being developed. Features may be incomplete or subject to change.

A URL shortening web application with a full user system and personal dashboard to manage your shortened links.

---

## Tech Stack

### Frontend
- **React 19** with **Vite**
- **Tailwind CSS** for styling
- **React Router** for client-side routing

### Backend
- **FastAPI** — high-performance Python web framework
- **PostgreSQL** — relational database for persistent storage
- **Redis** — caching and token management

### Infrastructure
- **Docker Compose** — orchestrates all services locally

---

## Features

- 🔗 **URL Shortening** — Generate short, shareable links from long URLs
- 👤 **User Accounts** — Register and log in to manage your links
- 📊 **Personal Dashboard** — View and manage all of your shortened URLs in one place
- 🔒 **Secure Authentication**
  - Password hashing with `bcrypt` via `passlib`
  - JWT access tokens and refresh tokens (`python-jose`)
  - Rotating refresh tokens for enhanced security

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (for running the frontend in development)
- [Python 3.10+](https://www.python.org/) (for running the backend outside of Docker)

### Running with Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/cburke6897/URL-Cutr.git
   cd URL-Cutr
   ```

2. Create a `.env` file in the `backend/` directory (see `backend/.env.example` if available).

3. Start all services:
   ```bash
   docker compose up --build
   ```

4. Services will be available at:
   | Service  | URL                        |
   |----------|----------------------------|
   | Backend API | http://localhost:8000   |
   | Adminer (DB UI) | http://localhost:8080 |

### Running the Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will start at `http://localhost:5173` by default.

### Running the Backend Locally

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Project Structure

```
URL-Cutr/
├── frontend/          # Vite + React application
│   └── src/
├── backend/           # FastAPI application
│   └── app/
│       ├── api/       # Route handlers
│       ├── core/      # Config, security utilities
│       ├── cruds/     # Database CRUD operations
│       ├── db/        # Database session setup
│       ├── models/    # SQLAlchemy models
│       ├── schemas/   # Pydantic schemas
│       └── services/  # Business logic
└── docker-compose.yml
```

---

## Roadmap

- [ ] URL click analytics
- [ ] Custom short link aliases
- [ ] Link expiration settings
- [ ] Admin panel

---

## License

This project does not currently have a license. All rights reserved by the author.
