import fs from "node:fs";
import path from "node:path";

const siteUrl = (process.env.VITE_SITE_URL || "http://localhost:5173").replace(/\/$/, "");
const publicDir = path.resolve(process.cwd(), "public");
const today = new Date().toISOString().slice(0, 10);

const urls = [
  "/site",
  "/site/about",
  "/site/contact",
  "/site/parent-guidance",
  "/site/emergency",
  "/site/forms/contact",
  "/site/forms/consultation",
  "/site/forms/parent-inquiry",
  "/site/forms/school-inquiry"
];

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(
    (url) => `  <url>\n    <loc>${siteUrl}${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${url === "/site" ? "1.0" : "0.8"}</priority>\n    <lastmod>${today}</lastmod>\n  </url>`
  )
  .join("\n")}\n</urlset>\n`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots, "utf8");
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
