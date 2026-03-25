import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const baseUploadDir = path.resolve(process.cwd(), "backend", "uploads");
const documentDir = path.join(baseUploadDir, "documents");
const imageDir = path.join(baseUploadDir, "images");

[baseUploadDir, documentDir, imageDir].forEach((directory) => {
  fs.mkdirSync(directory, { recursive: true });
});

function sanitizeBaseName(filename: string) {
  return filename
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function createStorage(targetDirectory: string) {
  return multer.diskStorage({
    destination: (_request, _file, callback) => {
      callback(null, targetDirectory);
    },
    filename: (_request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const basename = path.basename(file.originalname, extension);
      const safeName = sanitizeBaseName(basename) || "file";
      const uniqueSuffix = crypto.randomBytes(6).toString("hex");

      callback(null, `${Date.now()}-${safeName}-${uniqueSuffix}${extension}`);
    }
  });
}

function fileFilter(allowedExtensions: string[]) {
  return (_request: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return callback(new Error(`File type ${extension || "unknown"} is not allowed.`));
    }

    return callback(null, true);
  };
}

export const documentUpload = multer({
  storage: createStorage(documentDir),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter([".pdf", ".doc", ".docx", ".txt", ".rtf"])
});

export const imageUpload = multer({
  storage: createStorage(imageDir),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: fileFilter([".jpg", ".jpeg", ".png", ".webp"])
});

export const uploadsPath = baseUploadDir;
