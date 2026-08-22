# 🌍 GlobeTrotter — Personalized Travel Planning Platform

A full-stack web application for planning, organizing, and tracking personalized travel experiences. Built for LDCE Odoo Hackathon 2026.

---

## ✨ Features

- 🔐 **Authentication** — Email/password & OAuth login via Supabase Auth
- 🗺️ **Trip Planning** — Create trips with dates, budget, travel style, and cover image
- 📅 **Itinerary Builder** — Day-by-day activity scheduling with drag-and-drop support
- 🏙️ **City Search** — Search destinations powered by Geoapify
- 💰 **Trip Budget Tracker** — Track and manage per-trip expenses
- 📆 **Trip Calendar** — Visual calendar view of scheduled activities
- 👤 **User Profile** — Edit name, avatar, language, and travel preferences
- 🔗 **Shared Itineraries** — Share a read-only trip itinerary via public link
- 🐳 **Docker Support** — Backend containerized via Docker Compose

---

## 🛠️ Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| **Frontend** | React 18, Vite 5, React Router v6, Lucide Icons |
| **Styling**  | Vanilla CSS (custom design system)              |
| **Backend**  | Node.js, Express 4, Prisma ORM                  |
| **Database** | Supabase (PostgreSQL, hosted)                   |
| **Auth**     | Supabase Auth (JWT, OAuth)                      |
| **Maps/Geo** | Geoapify Places & Geocoding API                 |
| **DevOps**   | Docker, Docker Compose, Nodemon                 |

---

## 📂 Project Structure

```text
odoo_LDCE26/
├── frontend/                  # React + Vite client
│   ├── src/
│   │   ├── context/           # Auth, Toast global state
│   │   ├── pages/             # App pages (Dashboard, CreateTrip, etc.)
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API clients (Supabase, Axios)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Page layout wrappers
│   │   └── lib/               # Utilities and helpers
│   ├── index.html
│   └── vite.config.js
│
├── backend/                   # Express + Prisma API server
│   ├── controllers/           # Route handler logic
│   ├── routes/                # Express route definitions
│   ├── middleware/            # Auth and validation middleware
│   ├── services/              # Business logic services
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── supabase/              # Supabase schema & migrations
│   ├── server.js              # Express entry point
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A **Supabase** project (for auth and PostgreSQL database)
- A **Geoapify** API key (for city search)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Prajapati-Krishna18/odoo_LDCE26.git
cd odoo_LDCE26
```

---

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/postgres"
JWT_SECRET="your_jwt_secret"
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SECRET_KEY=<your-service-role-key>
```

Run Prisma migrations to set up your database schema:

```bash
npm run db:migrate
```

Start the backend dev server:

```bash
npm run dev
# Server runs at http://localhost:5000
```

---

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_GEOAPIFY_API_KEY=<your-geoapify-api-key>
```

Start the frontend dev server:

```bash
npm run dev
# App runs at http://localhost:5173
```

---

### 4. (Optional) Run with Docker

```bash
cd backend
docker-compose up --build
```

---

## 🔑 Available npm Scripts

### Frontend (`frontend/`)

| Command           | Description                  |
|-------------------|------------------------------|
| `npm run dev`     | Start Vite dev server        |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview production build     |

### Backend (`backend/`)

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start Express server with nodemon  |
| `npm run start`      | Start Express server (production)  |
| `npm run db:migrate` | Run Prisma database migrations     |
| `npm run db:seed`    | Seed the database                  |
| `npm run db:studio`  | Open Prisma Studio (DB GUI)        |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
