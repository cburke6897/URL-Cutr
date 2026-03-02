# URL Cutr

A full-stack URL shortening application with user authentication, custom short codes, and account management.

## Features

- **User Authentication**
  - Sign up and login with email/password
  - JWT-based authentication with refresh tokens
  - Secure password hashing with bcrypt
  - Password reset via email links
  - Account deletion with cascading data cleanup

- **URL Management**
  - Shorten URLs with auto-generated or custom codes
  - Set expiration times for shortened URLs
  - View all shortened URLs in a dashboard
  - Copy short URLs with one click
  - Delete individual shortened URLs

- **User Account**
  - Change username
  - Reset password via email
  - Delete account (removes all associated URLs and tokens)
  - Admin badge display for admin users

- **Security & Performance**
  - Rate limiting to prevent abuse
  - Redis caching for improved performance
  - Automatic cleanup of expired URLs
  - CORS protection
  - Input validation and email verification

- **User Experience**
  - Dark/light mode toggle with persistent theme
  - Keyboard navigation (Enter key to submit, arrow keys for menus)
  - Responsive design with Tailwind CSS
  - Error and success message alerts
  - Smooth transitions and modern UI

## Tech Stack

### Frontend
- **JavaScript** - Programming language
- **React 19** - UI framework
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Styling with CSS variables and OKLCH color space
- **Vite** - Build tool and dev server
- **Heroicons** - Icon library

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Primary database
- **Redis** - Caching and rate limiting
- **Python-jose** - JWT token generation and validation
- **Passlib & Bcrypt** - Password hashing
- **Resend** - Email service for password resets
- **Pydantic** - Data validation

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **PostgreSQL 18.1** - Database
- **Redis 8.6** - Cache and session store
- **Adminer** - Database admin interface

## Prerequisites

- **Node.js 18+** - Required for running the frontend
- Docker & Docker Compose (for running backend services)
- Or alternatively (if not using Docker):
  - Python 3.8+
  - PostgreSQL 12+
  - Redis 6+

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd url-shortener
```

### 2. Environment Variables

#### Root Level (.env)

Create `.env` in the project root (for Docker Compose):

```env
POSTGRES_PASSWORD=your_secure_password_here
```

#### Backend (.env)

Create `backend/.env` (for FastAPI application):

```env
DATABASE_URL=postgresql://postgres:your_password@db:5432/cutr_db
REDIS_URL=redis://:your_redis_password@redis:6379/0

ACCESS_TOKEN_SECRET_KEY=your_access_token_secret_min_32_chars
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret_min_32_chars

RESEND_API_KEY=your_resend_api_key_here
SUPPORT_EMAIL=support@yourapp.com
```

**Required Variables:**
- `POSTGRES_PASSWORD` - Database password (matches root .env)
- `DATABASE_URL` - Full PostgreSQL connection string
- `ACCESS_TOKEN_SECRET_KEY` - Secret for signing access tokens (32+ chars)
- `REFRESH_TOKEN_SECRET_KEY` - Secret for signing refresh tokens (32+ chars)
- `RESEND_API_KEY` - API key from [resend.com](https://resend.com)
- `SUPPORT_EMAIL` - Email for support notifications

### 3. Redis Configuration

Create `redis.conf` in the project root:

```conf
requirepass your_redis_password_here
bind 0.0.0.0
protected-mode yes
```

**Key Settings:**
- `requirepass` - Password for Redis authentication (must match `REDIS_URL` in `backend/.env`)
- `bind 0.0.0.0` - Listen on all network interfaces (required for Docker networking)
- `protected-mode yes` - Additional security layer (enabled by default)

## Running the Project

### With Docker Compose (Recommended)

1. Start backend services (database, Redis, etc.):
   ```bash
   cd backend
   docker compose up --build
   ```

2. In a new terminal, install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

Services will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Adminer (database UI): http://localhost:8080

## Project Structure

```
url-shortener/
├── backend/
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── auth_routes.py       # Login, signup, logout
│   │   │   ├── url_routes.py        # URL shortening
│   │   │   ├── reset_routes.py      # Password reset
│   │   │   └── delete_routes.py     # Account deletion
│   │   ├── core/
│   │   │   ├── config.py            # Settings
│   │   │   ├── security.py          # Password hashing, JWT
│   │   │   └── tlds.py              # TLD validation
│   │   ├── cruds/
│   │   │   ├── user_crud.py
│   │   │   ├── url_crud.py
│   │   │   ├── refresh_token_crud.py
│   │   │   └── reset_token_crud.py
│   │   ├── db/
│   │   │   ├── session.py           # Database connection
│   │   │   └── base.py
│   │   ├── models/                  # SQLAlchemy models
│   │   ├── schemas/                 # Pydantic schemas
│   │   └── services/                # Business logic
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # URL shortening
│   │   │   ├── Dashboard.jsx        # Manage URLs
│   │   │   ├── Auth.jsx             # Login/signup
│   │   │   ├── ChangePassword.jsx   # Password reset token
│   │   │   ├── ChangeUsername.jsx   # Change username
│   │   │   ├── DeleteAccount.jsx    # Account deletion token
│   │   │   └── ResetPassword.jsx    # Request password reset
│   │   ├── components/
│   │   │   ├── TextInput.jsx
│   │   │   ├── EnterButton.jsx
│   │   │   ├── DropdownMenu.jsx     # Keyboard navigable
│   │   │   ├── UsernameLabel.jsx    # Keyboard navigable
│   │   │   └── AlertModal.jsx       # Success/error alerts
│   │   ├── utils/
│   │   │   ├── Auth.js              # Authentication
│   │   │   ├── User.js              # User management
│   │   │   ├── Url.js               # URL operations
│   │   │   └── ResetPassword.js     # Password reset
│   │   ├── index.css                # CSS variables, theme
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── redis.conf
└── README.md
```

## API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /refresh` - Refresh access token

### URL Shortening
- `POST /shorten` - Create shortened URL
- `GET /urls` - Get user's URLs
- `GET /url/{short_code}` - Redirect to original URL
- `DELETE /url/{id}` - Delete shortened URL

### User Management
- `GET /me` - Get current user
- `POST /change-username` - Change username
- `POST /change-password` - Change password

### Password Reset
- `POST /request-reset` - Send reset email
- `POST /verify-reset-token` - Verify reset token
- `POST /reset-password` - Complete password reset

### Account Deletion
- `POST /request-delete` - Send delete confirmation email
- `POST /verify-delete-token` - Verify delete token
- `POST /delete-account` - Permanently delete account

## Database & Caching

### PostgreSQL
- Stores users, URLs, tokens, and refresh tokens
- Auto-creates tables on startup
- Automatic cleanup of expired URLs

### Redis
- Stores rate limiting data
- Can be used for session caching
- Configurable memory limits and eviction policies (see `redis.conf`)

### Adminer
- Database management UI available at `http://localhost:8080`
- Login with credentials from `docker-compose.yml`

## Authentication Flow

1. **Signup/Login** → JWT access token + refresh token (HTTP-only cookie)
2. **Access Token** → Used in Authorization header for API requests
3. **Refresh Token** → Used to get new access token when expired
4. **Logout** → Clears refresh token
5. **Password Reset** → Email link with time-limited token
6. **Account Deletion** → Email confirmation with time-limited token

## Key Features in Detail

### Dark Mode
- CSS variables with OKLCH color space for perceptual uniformity
- Stored in localStorage
- Applied globally via `.dark` class

### Keyboard Navigation
- Enter key submits forms across all pages
- Arrow keys navigate dropdown menus
- Escape closes menus
- Fully accessible without mouse

### Security
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens for stateless authentication
- Rate limiting on sensitive endpoints
- CORS middleware for cross-origin protection
- Time-limited reset and delete tokens
- Email verification for account changes

### Performance
- Redis caching for frequently accessed data
- Automatic cleanup of expired URLs (runs periodically)
- Optimized database queries with SQLAlchemy
- Frontend bundling with Vite

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify password matches `POSTGRES_PASSWORD`

### Redis Connection Error
- Ensure Redis is running
- Check `REDIS_URL` in `.env`
- Verify `redis.conf` is being used

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend account for API key
- Verify sender domain is verified in Resend

### Port Already in Use
- Change ports in `docker-compose.yml`
- Or check `lsof -i :port` to find and kill process

## Development

### Code Quality
- ESLint for JavaScript/React linting
- Python type hints with Pydantic
- Consistent code formatting

## Deployment

1. Set production environment variables
2. Build frontend: `npm run build`
3. Update `FRONTEND_URL` in backend `.env`
4. Use production-grade database (managed PostgreSQL)
5. Use managed Redis service (AWS ElastiCache, Redis Cloud)
6. Deploy backend (Heroku, Render, AWS ECS)
7. Deploy frontend (Vercel, Netlify, S3 + CloudFront)

## License

MIT
