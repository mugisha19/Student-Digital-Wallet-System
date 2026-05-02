# Student Digital Wallet System

A full-stack digital wallet application for students.

## Stack

- **Backend**: ASP.NET Core 8 Web API, EF Core, SQL Server, ASP.NET Identity + JWT
- **Frontend**: React + Vite + TypeScript, TanStack Query, React Router, Axios

## Project layout

```
.
├── backend/
│   └── StudentWallet.Api/      # ASP.NET Core 8 Web API
└── frontend/                    # Vite + React + TypeScript SPA
```

## Development

### Backend

```bash
cd backend/StudentWallet.Api
dotnet restore
dotnet ef database update    # apply migrations
dotnet run
```

API runs on `https://localhost:7129` and `http://localhost:5102`. Swagger UI at `/swagger`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite dev server runs on `http://localhost:5173` and proxies `/api/*` to the backend.

## Status

Project under active development. See commit history for current feature set.
