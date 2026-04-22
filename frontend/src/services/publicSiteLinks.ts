import { getBackendOrigin } from "../lib/api";
import type { PublicFormDefinition, PublicNavEntry, PublicSiteItem, PublicSiteManagerState } from "../types";

export interface ResolvedPublicTarget {
  id: string;
  title: string;
  kind: "page" | "external" | "form";
  href: string;
  status: "draft" | "published" | "archived";
  summary: string;
}

function appendPreview(href: string, preview: boolean) {
  if (!preview) {
    return href;
  }

  return `${href}${href.includes("?") ? "&" : "?"}preview=1`;
}

function normalizeSlug(slug: string) {
  if (!slug || slug === "/") {
    return "";
  }

  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function getMainPublicSiteHref(preview = false) {
  return appendPreview("/site", preview);
}

export function getPublicSiteItemHref(item: PublicSiteItem, preview = false) {
  if (item.pageType === "external_html") {
    const servedHref = item.servedUrl?.trim() || (item.servedPath ? new URL(item.servedPath, `${getBackendOrigin()}/`).toString() : "");
    const href = servedHref || item.externalUrl?.trim() || "";

    if (!href) {
      return "";
    }

    if (item.status !== "published" && !preview) {
      return "";
    }

    return appendPreview(href, preview || item.status !== "published");
  }

  if (item.status !== "published" && !preview) {
    return "";
  }

  const basePath = item.slug === "/" ? "/site" : `/site${normalizeSlug(item.slug)}`;
  return appendPreview(basePath, preview || item.status !== "published");
}

export function getPublicFormHref(form: PublicFormDefinition, preview = false) {
  if (form.status !== "published" && !preview) {
    return "";
  }

  return appendPreview(`/site${normalizeSlug(form.slug)}`, preview || form.status !== "published");
}

export function resolvePublicTargetHref(
  state: PublicSiteManagerState,
  targetType: PublicNavEntry["targetType"],
  targetId: string | null | undefined,
  preview = false
) {
  if (!targetId) {
    return "";
  }

  if (targetType === "form") {
    const form = state.forms.find((item) => item.id === targetId);
    return form ? getPublicFormHref(form, preview) : "";
  }

  const item = state.items.find((entry) => entry.id === targetId);
  return item ? getPublicSiteItemHref(item, preview) : "";
}

export function resolveTargetDetails(
  state: PublicSiteManagerState,
  targetType: PublicNavEntry["targetType"],
  targetId: string,
  preview = false
): ResolvedPublicTarget | null {
  if (targetType === "form") {
    const form = state.forms.find((entry) => entry.id === targetId);
    const href = form ? getPublicFormHref(form, preview) : "";
    if (!form || !href) {
      return null;
    }
    return {
      id: form.id,
      title: form.title,
      kind: "form",
      href,
      status: form.status,
      summary: form.summary
    };
  }

  const item = state.items.find((entry) => entry.id === targetId);
  const href = item ? getPublicSiteItemHref(item, preview) : "";
  if (!item || !href) {
    return null;
  }
  return {
    id: item.id,
    title: item.title,
    kind: item.pageType === "external_html" ? "external" : "page",
    href,
    status: item.status,
    summary: item.summary
  };
}

export function getVisibleNavigationTargets(state: PublicSiteManagerState, preview = false) {
  return state.mainWebsite.navigation
    .map((entry) => ({
      ...entry,
      href: resolvePublicTargetHref(state, entry.targetType, entry.targetId, preview)
    }))
    .filter((entry) => entry.href);
}

export function getFeaturedTargets(state: PublicSiteManagerState, preview = false) {
  return state.mainWebsite.featuredPageIds
    .map((targetId) => {
      const form = state.forms.find((entry) => entry.id === targetId);
      if (form) {
        return resolveTargetDetails(state, "form", form.id, preview);
      }

      const item = state.items.find((entry) => entry.id === targetId);
      if (!item) {
        return null;
      }

      return resolveTargetDetails(state, item.pageType === "external_html" ? "external" : "page", item.id, preview);
    })
    .filter((target): target is ResolvedPublicTarget => Boolean(target));
}
