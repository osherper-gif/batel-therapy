# BATEL Launch Checklist

## Hosting

- [ ] Frontend project connected to Vercel or Netlify
- [ ] Backend project connected to Render or Railway
- [ ] Production build succeeds on the hosting provider

## Environment variables

- [ ] Frontend `VITE_API_URL` set
- [ ] Frontend `VITE_SITE_URL` set
- [ ] Backend `CLIENT_URL` set
- [ ] Backend `CORS_ORIGINS` set
- [ ] Backend `JWT_SECRET` set
- [ ] Backend admin credentials set
- [ ] Backend `DATABASE_URL` set to persistent storage

## Google OAuth

- [ ] `GOOGLE_CLIENT_ID` set
- [ ] `GOOGLE_CLIENT_SECRET` set
- [ ] `GOOGLE_CALLBACK_URL` set to `https://api.YOUR_PUBLIC_DOMAIN/api/auth/google/callback`
- [ ] Authorized origin set in Google Cloud Console
- [ ] Authorized redirect URI set in Google Cloud Console

## Domain and DNS

- [ ] `www.YOUR_PUBLIC_DOMAIN` points to frontend host
- [ ] `api.YOUR_PUBLIC_DOMAIN` points to backend host
- [ ] HTTPS is active on both hosts
- [ ] Root domain redirects to `www`

## Functional smoke

- [ ] Login page loads
- [ ] Local login works
- [ ] Google login fails gracefully if not configured / succeeds if configured
- [ ] Dashboard loads
- [ ] Patients page loads
- [ ] Sessions page loads
- [ ] Public site `/site` loads
- [ ] Public forms routes load
- [ ] External resource route loads

## SEO

- [ ] `/robots.txt` reachable
- [ ] `/sitemap.xml` reachable
- [ ] Public site title and meta description correct
- [ ] Canonical link points to production domain

## QA

- [ ] BATEL Quality Center build passes
- [ ] Automation manifest can run against production or preview target
- [ ] QC import flow tested with a recent JSON run
- [ ] PDF export tested
