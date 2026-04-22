# Batel Therapy Management App

Phase 1 MVP for a local-first therapy management application for Batel, an art therapist working with children in schools and private sessions.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite + Prisma
- Storage: local filesystem uploads
- Auth: single-admin JWT authentication

## Database note

Phase 1 uses `prisma db push` through the `prisma:migrate` script instead of tracked SQL migrations. This keeps local setup lighter for a single-admin MVP while preserving a clean Prisma schema for future migration-based workflows.

## Project structure

```text
.
|- backend
|  |- prisma
|  |- src
|  \- uploads
|- frontend
|  |- public
|  \- src
\- .env.example
```

## Quick start

1. Copy `.env.example` to `.env` in the project root.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Generate Prisma client and create the SQLite database:

   ```bash
   npm --workspace backend run prisma:generate
   npm --workspace backend run prisma:migrate
   npm run seed
   ```

4. Start the backend:

   ```bash
   npm run dev:backend
   ```

5. In a second terminal, start the frontend:

   ```bash
   npm run dev:frontend
   ```

6. Open `http://localhost:5173`.

## Default login

- Username: value of `ADMIN_USERNAME`
- Password: value of `ADMIN_PASSWORD`

If you keep the sample `.env` values, the first login is:

- Username: `batel`
- Password: `ChangeMe123!`

## Phase 1 modules

- Single admin authentication
- Dashboard
- Patients CRUD
- Sessions CRUD
- Stakeholders CRUD
- Document upload with metadata
- Image upload with metadata
- Local file storage
- Hebrew RTL-friendly UI

## Future extension points

- AI summaries and recommendations can be added as separate service tables and background jobs without mixing generated drafts into the original clinical data.
- WhatsApp reminders can plug into the session and stakeholder tables through an outbound reminders table.
- Google Drive backup can later sync the `uploads/` folder and SQLite snapshots.
- Billing can be added with invoice and payment models linked to patients and sessions.

## Production deployment

Production deployment assets, env templates, DNS guidance, SEO files and launch checklist are documented in:

- `docs/PRODUCTION_DEPLOYMENT.md`
- `docs/LAUNCH_CHECKLIST.md`
