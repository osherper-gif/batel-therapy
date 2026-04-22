import express from "express";
import fs from "node:fs";
import { getExternalPublicAssetBySlug } from "../public-assets-registry.js";

export const publicAssetsRouter = express.Router();

function renderHtmlMessage(title: string, description: string) {
  return `<!doctype html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body {
        font-family: "Segoe UI", Arial, sans-serif;
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f7f3ed;
        color: #244034;
      }
      main {
        width: min(720px, calc(100vw - 32px));
        background: #fff;
        border: 1px solid #e4d8c7;
        border-radius: 20px;
        padding: 32px;
        box-shadow: 0 12px 40px rgba(36, 64, 52, 0.08);
      }
      h1 {
        margin: 0 0 12px;
        font-size: 32px;
      }
      p {
        margin: 0;
        line-height: 1.7;
        color: #586c63;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>${title}</h1>
      <p>${description}</p>
    </main>
  </body>
</html>`;
}

publicAssetsRouter.get("/external/:slug", (request, response) => {
  const asset = getExternalPublicAssetBySlug(request.params.slug);

  if (!asset) {
    response
      .status(404)
      .type("html")
      .send(renderHtmlMessage("המשאב לא נמצא", "לא נמצא נכס ציבורי רשום עבור הכתובת שביקשת."));
    return;
  }

  if (!fs.existsSync(asset.sourcePath)) {
    response
      .status(404)
      .type("html")
      .send(
        renderHtmlMessage(
          "קובץ המקור חסר",
          `המשאב "${asset.title}" רשום במערכת, אבל קובץ המקור שלו לא נמצא כרגע בדיסק.`
        )
      );
    return;
  }

  const html = fs.readFileSync(asset.sourcePath, "utf8");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self' data: blob: https: http:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: blob: https: http:; font-src 'self' data: https: http:; connect-src 'self' https: http:; frame-ancestors 'self'; base-uri 'self'"
  );
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.send(html);
});
