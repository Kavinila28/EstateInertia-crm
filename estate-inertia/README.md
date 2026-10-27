# Estate Inertia — Real Estate CRM starter

A responsive real-estate CRM starter inspired by the clean property-workspace approach in the Plotbriar reference. This is a code-first project and does not depend on Lovable credits.

## Stack
- Frontend: React + Vite + TypeScript + Tailwind CSS
- API: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma
- Auth foundation: hashed passwords and JWT access tokens

## Requirements
- Node.js 20+
- PostgreSQL 15+ (local install or hosted PostgreSQL)
- npm

## Start the UI
1. Install Node.js 20+ and PostgreSQL.
2. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL` and a long random `JWT_SECRET`.
3. From this folder run `npm install`.
4. Run `npm run db:generate`.
5. Run `npm run db:migrate`.
6. Run `npm run dev`.
7. Open the Vite URL printed in the terminal (usually `http://localhost:5173`).

## Important implementation notes
- The initial UI uses clearly labelled sample dashboard metrics and sample inventory to make the interface previewable. They are not database records.
- The API includes database-backed registration/login and a protected properties endpoint foundation. Expand the same pattern for projects, leads, follow-ups, files and plot layouts before production use.
- Phone OTP is intentionally not faked. Choose an SMS provider (for example, an India-supported OTP/SMS service), configure its credentials privately in environment variables, then implement provider verification before enabling OTP login.
- Before production, add refresh-token/session revocation, rate limiting, email verification/password reset, audit logs, strict upload validation and malware scanning, backups, tests, and a deployment configuration. Do not expose secrets in frontend environment variables.

## Brand
Estate Inertia
