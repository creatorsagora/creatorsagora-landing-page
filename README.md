# CREATORSAGORA Frontend

This folder contains the CREATORSAGORA landing page frontend built with Next.js + Tailwind CSS (web-first with mobile behavior support).

## Structure

- `app/` - Next.js app router entry files.
- `components/landing/` - Landing page sections and mobile dock components.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend API URL

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Auth pages now call the backend:
- `/auth/signup`
- `/auth/login`

Separate admin login route:
- `/adminlogin` (then redirects to `/admin`).
