# Estate Inertia API starter
Node.js + Express + TypeScript + PostgreSQL.

## Endpoints
- GET `/api/health`
- GET `/api/properties?page=1&limit=20&search=&status=&property_type=`
- GET `/api/properties/:id`
- POST `/api/properties`
- PATCH `/api/properties/:id`
- DELETE `/api/properties/:id`

## Deploy
1. Put this backend in a separate folder/repository or add it to your existing repo as `server`.
2. Provision a PostgreSQL database and copy its connection string.
3. Create a Render **Web Service** for the backend folder.
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Set environment variables: `DATABASE_URL` (secret), `DATABASE_SSL=true` if provider requires TLS, `FRONTEND_URL=https://estateinertia-crm-1.onrender.com`, `NODE_ENV=production`.
7. Check `https://YOUR-API.onrender.com/api/health`.

This starter does not yet include login/authentication, tenant/company isolation, customers/leads/projects APIs, uploads, audit logs or production test coverage. Do not store real customer data until authentication and access controls are added. Never commit `.env` or expose DATABASE_URL in frontend code.
