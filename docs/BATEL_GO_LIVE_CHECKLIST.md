# BATEL GO LIVE Checklist

רשימת הבדיקה הזו מיועדת ליום העלייה לאוויר של BATEL.
המטרה היא לעבור שלב־שלב על הדומיין, הפריסה, ההגדרות, האבטחה, ה-SEO וה-QA עד שהמערכת מוכנה לחשיפה אמיתית.

## 1. Domain Setup

### 1.1 רכישת דומיין
- לרכוש את הדומיין הציבורי הראשי של BATEL.
- להחליט על מבנה קבוע:
  - `https://www.YOUR_PUBLIC_DOMAIN` עבור האתר הציבורי וה-frontend.
  - `https://api.YOUR_PUBLIC_DOMAIN` עבור ה-backend.
- להחליט האם הדומיין הראשי `YOUR_PUBLIC_DOMAIN` יעשה redirect ל-`www`.

### 1.2 DNS records
- להגדיר `CNAME` או `A` record עבור `www` לפי ספק ה-hosting של ה-frontend.
- להגדיר `CNAME` או `A` record עבור `api` לפי ספק ה-hosting של ה-backend.
- להגדיר redirect מה-root domain ל-`https://www.YOUR_PUBLIC_DOMAIN`.
- להמתין להפצת DNS מלאה.

### 1.3 הפרדה בין www ו-api
- לאמת שה-frontend נגיש רק דרך `www`.
- לאמת שה-API נגיש דרך `api`.
- לאמת ש-CORS ב-backend כולל:
  - `https://www.YOUR_PUBLIC_DOMAIN`
  - `https://YOUR_PUBLIC_DOMAIN`

## 2. Frontend Deployment

### 2.1 Vercel deployment steps
- לחבר את ריפו BATEL ל-Vercel.
- לבחור את תיקיית ה-root של ה-frontend:
  - `frontend`
- להגדיר install/build:
  - Install: `npm ci`
  - Build: `npm run build`
  - Output: `dist`
- לאשר ש-[frontend/vercel.json](C:\Users\Administrator\Desktop\Claude\BATEL\ART_TR\frontend\vercel.json) קיים ומאפשר SPA fallback.

### 2.2 Environment variables
- להגדיר ב-Vercel:
  - `VITE_API_URL=https://api.YOUR_PUBLIC_DOMAIN`
  - `VITE_SITE_URL=https://www.YOUR_PUBLIC_DOMAIN`

### 2.3 Routing config
- לאמת refresh ידני על:
  - `/site`
  - `/site/about`
  - `/site/forms/contact`
  - `/patients`
  - `/sessions`
- לאמת שאין 404 על deep links.
- אם משתמשים ב-Netlify במקום Vercel:
  - לאמת ש-[frontend/netlify.toml](C:\Users\Administrator\Desktop\Claude\BATEL\ART_TR\frontend\netlify.toml) פעיל.

## 3. Backend Deployment

### 3.1 Render or Railway deployment steps
- לבחור host:
  - `Render` אם רוצים דיסק persistence מובנה ונוח ל-Node service.
  - `Railway` אם מעדיפים deployment מהיר וגמיש.
- לחבר את ריפו BATEL לספק ה-hosting.
- לוודא ש-command path תואם:
  - Build: `npm ci && npm --workspace backend run prisma:generate && npm --workspace backend run build`
  - Start: `npm run start`

### 3.2 Environment variables
- להגדיר ב-backend host:
  - `NODE_ENV=production`
  - `PORT=4000` או לפי הספק
  - `CLIENT_URL=https://www.YOUR_PUBLIC_DOMAIN`
  - `CORS_ORIGINS=https://www.YOUR_PUBLIC_DOMAIN,https://YOUR_PUBLIC_DOMAIN`
  - `JWT_SECRET=<strong-secret>`
  - `ADMIN_USERNAME=<real-admin-user>`
  - `ADMIN_PASSWORD=<real-admin-password>`
  - `DATABASE_URL=<persistent-db-path-or-managed-db-url>`
  - `GOOGLE_CLIENT_ID=<from-google-console>`
  - `GOOGLE_CLIENT_SECRET=<from-google-console>`
  - `GOOGLE_CALLBACK_URL=https://api.YOUR_PUBLIC_DOMAIN/api/auth/google/callback`
  - optional:
    - `GOOGLE_ALLOWED_EMAILS`
    - `GOOGLE_ALLOWED_DOMAIN`
    - `GOOGLE_DEFAULT_ROLE=admin`

### 3.3 Health check
- לאמת ש-`https://api.YOUR_PUBLIC_DOMAIN/health` מחזיר `200`.
- לאמת שגם route ה-public external asset עובד:
  - `https://api.YOUR_PUBLIC_DOMAIN/public/external/art-therapy-website`

## 4. Google OAuth

### 4.1 Google Cloud Console steps
- לפתוח OAuth client ב-Google Cloud Console.
- לבחור Web Application.
- להגדיר Authorized JavaScript origins:
  - `https://www.YOUR_PUBLIC_DOMAIN`
- להגדיר Authorized redirect URIs:
  - `https://api.YOUR_PUBLIC_DOMAIN/api/auth/google/callback`

### 4.2 Required env vars
- לוודא שהוגדרו:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_CALLBACK_URL`
- אם נדרש סינון גישה:
  - `GOOGLE_ALLOWED_EMAILS`
  - או `GOOGLE_ALLOWED_DOMAIN`

### 4.3 Validation
- לבדוק שכפתור `התחבר באמצעות Google` ב-BATEL login page מפנה ל-backend route הנכון.
- לבצע login אמיתי דרך Google עם משתמש מורשה.
- לוודא redirect חזרה ל-frontend והתחברות תקינה.

## 5. SEO

### 5.1 sitemap and robots
- לוודא שקיימים ונגישים:
  - `https://www.YOUR_PUBLIC_DOMAIN/robots.txt`
  - `https://www.YOUR_PUBLIC_DOMAIN/sitemap.xml`

### 5.2 Search Console
- לחבר את הדומיין ל-Google Search Console.
- לאמת בעלות על הדומיין.
- לשלוח את:
  - `https://www.YOUR_PUBLIC_DOMAIN/sitemap.xml`

### 5.3 Metadata validation
- לבדוק על `/site`:
  - title
  - meta description
  - canonical
  - Open Graph title/description
- לבדוק גם:
  - `/site/about`
  - `/site/forms/contact`

## 6. QA Validation

### 6.1 Automation run
- להריץ BATEL Quality Center smoke automation מול הסביבה הרלוונטית.
- לוודא שה-run יוצר JSON תקין.
- לייבא את התוצאות ל-QC.

### 6.2 Site validation
- לעבור ידנית על:
  - login
  - dashboard
  - patients
  - sessions
  - documents
  - `/site`
  - `/site/about`
  - `/site/forms/contact`
  - external resource route

### 6.3 Public site validation
- לוודא שהתמונה של בת-אל נטענת.
- לוודא שהעברית תקינה ולא מופיע mojibake.
- לוודא ש-CTA links עובדים.
- לוודא שטפסים ציבוריים נפתחים.

## 7. Final Launch Steps

### 7.1 לפני פתיחה לציבור
- לוודא שכל secrets הוזנו רק דרך hosting provider ולא נשמרו בקוד.
- לוודא שהדומיין מחובר ב-HTTPS תקין.
- לוודא שה-backend נגיש רק דרך ה-domain הציבורי המתוכנן.
- לוודא שמשתמש admin מקומי קיים עם סיסמה חזקה.

### 7.2 רגע לפני GO LIVE
- לבצע build אחרון:
  - frontend
  - backend
  - BATEL Quality Center
- לבצע smoke test אחרון.
- לבדוק `/health`.
- לבדוק Google OAuth.
- לבדוק `/site` על מובייל ודסקטופ.

### 7.3 אחרי העלייה לאוויר
- לבדוק logs ב-frontend host.
- לבדוק logs ב-backend host.
- לבדוק Search Console indexing status.
- לבדוק שה-QA automation עדיין מסוגל לרוץ מול הסביבה.
- לתעד תאריך עלייה לאוויר וגרסה.
