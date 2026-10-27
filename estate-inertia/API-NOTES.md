# API notes

Base URL in development: `http://localhost:4000`

- `GET /api/health` — health check
- `POST /api/auth/register` — `{ "name", "companyName", "email", "password", "phone?" }`
- `POST /api/auth/login` — `{ "email", "password" }`
- `GET /api/auth/me` — protected; send `Authorization: Bearer <token>`
- `GET /api/properties` — protected, company-scoped
- `POST /api/properties` — protected; fields include `code`, `title`, `type`, `location`, and optional `status`, `areaValue`, `areaUnit`, `price`, `description`, `projectId`
- `GET /api/leads` — protected, company-scoped

The phone field is collected during registration but is not verified by OTP yet. Do not treat it as verified until an SMS/OTP provider flow is integrated.
