import path from "node:path";

export type ExternalPublicAssetSourceType = "single_html_file" | "html_directory";

export interface ExternalPublicAssetDefinition {
  id: string;
  title: string;
  slug: string;
  sourceType: ExternalPublicAssetSourceType;
  sourcePath: string;
  servedPath: string;
  summary: string;
}

const projectRoot = path.resolve(process.cwd(), "..");

export const externalPublicAssets: ExternalPublicAssetDefinition[] = [
  {
    id: "external-art-therapy-site",
    title: "art_therapy_website",
    slug: "art-therapy-website",
    sourceType: "single_html_file",
    sourcePath: path.join(projectRoot, "art_therapy_website.html"),
    servedPath: "/public/external/art-therapy-website",
    summary: "אתר HTML קיים שמוגש דרך BATEL כמשאב ציבורי מנוהל."
  }
];

export function getExternalPublicAssetBySlug(slug: string) {
  return externalPublicAssets.find((asset) => asset.slug === slug) ?? null;
}
