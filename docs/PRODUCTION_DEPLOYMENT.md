# BATEL Production Deployment Guide

## Recommended architecture

- Frontend/public site host: Vercel or Netlify
- Backend/API host: Render or Railway
- Public domain: `https://www.YOUR_PUBLIC_DOMAIN`
- API domain: `https://api.YOUR_PUBLIC_DOMAIN`

## Frontend deployment

Deploy the `frontend` folder as a static SPA.

### Required frontend env vars

- `VITE_API_URL=https://api.YOUR_PUBLIC_DOMAIN`
- `VITE_SITE_URL=https://www.YOUR_PUBLIC_DOMAIN`

### Vercel

1. Import `ART_TR/frontend` as a Vercel project.
2. Framework preset: `Vite`.
3. Build command: `npm ci && npm run build`
4. Output directory: `dist`
5. Set env vars from `frontend/.env.production.example`.

### Netlify

1. Import `ART_TR/frontend`.
2. Build command: `npm ci && npm run build`
3. Publish directory: `dist`
4. Set env vars from `frontend/.env.production.example`.

### SPA routes that must work after deploy

- `/site`
- `/site/about`
- `/site/contact`
- `/site/parent-guidance`
- `/site/forms/contact`
- `/site/forms/consultation`

## Backend deployment

Deploy the repository root or backend service to Render or Railway.

### Required backend env vars

- `NODE_ENV=production`
- `CLIENT_URL=https://www.YOUR_PUBLIC_DOMAIN`
- `CORS_ORIGINS=https://www.YOUR_PUBLIC_DOMAIN,https://YOUR_PUBLIC_DOMAIN`
- `JWT_SECRET=<strong secret>`
- `ADMIN_USERNAME=<admin username>`
- `ADMIN_PASSWORD=<strong password>`
- `DATABASE_URL=file:/opt/render/project/data/dev.db` (Render + persistent disk example)
- `GOOGLE_CLIENT_ID=<google client id>`
- `GOOGLE_CLIENT_SECRET=<google client secret>`
- `GOOGLE_CALLBACK_URL=https://api.YOUR_PUBLIC_DOMAIN/api/auth/google/callback`
- `GOOGLE_ALLOWED_EMAILS=<optional comma separated allowlist>`
- `GOOGLE_ALLOWED_DOMAIN=<optional domain allowlist>`
- `GOOGLE_DEFAULT_ROLE=admin`

### Render

Use `render.yaml` from the repo root. Attach a persistent disk and set `DATABASE_URL` to the mounted disk path.

### Railway

Use `railway.json` and configure the same backend env vars in the Railway dashboard.

## Domain and DNS

Recommended DNS:

- `www.YOUR_PUBLIC_DOMAIN` -> CNAME to your frontend host target
- `api.YOUR_PUBLIC_DOMAIN` -> CNAME to your backend host target
- Root/apex domain -> redirect to `https://www.YOUR_PUBLIC_DOMAIN`

## Google OAuth production setup

In Google Cloud Console:

- Authorized JavaScript origin:
  - `https://www.YOUR_PUBLIC_DOMAIN`
- Authorized redirect URI:
  - `https://api.YOUR_PUBLIC_DOMAIN/api/auth/google/callback`

The frontend Google button already redirects to the backend start route. If credentials are missing, the flow fails gracefully back to `/login`.

## SEO artifacts

The frontend build generates:

- `robots.txt`
- `sitemap.xml`

Both are generated from `VITE_SITE_URL` during `npm run build`.

## Manual go-live validation

1. Open `https://www.YOUR_PUBLIC_DOMAIN/site`
2. Verify `robots.txt` and `sitemap.xml`
3. Verify `/site/about`, `/site/contact`, `/site/forms/contact`
4. Verify API health at `https://api.YOUR_PUBLIC_DOMAIN/health`
5. Verify external asset route at `https://api.YOUR_PUBLIC_DOMAIN/public/external/art-therapy-website`
6. Verify local login and Google login graceful handling
