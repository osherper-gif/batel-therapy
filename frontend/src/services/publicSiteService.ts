import type {
  MainWebsiteSettings,
  PublicFormDefinition,
  PublicSiteItem,
  PublicSiteItemStatus,
  PublicSiteManagerState
} from "../types";

const STORAGE_KEY = "batel-public-site-manager";
const CONTENT_VERSION = "batel-public-site-v6";
const EXTERNAL_WEBSITE_FILE = "C:\\Users\\Administrator\\Desktop\\Claude\\BATEL\\ART_TR\\art_therapy_website.html";
const ART_THERAPY_WEBSITE_SERVED_PATH = "/public/external/art-therapy-website";

function nowIso() {
  return new Date().toISOString();
}

function withVersion<T extends Record<string, unknown>>(payload: T) {
  return {
    ...payload,
    contentVersion: CONTENT_VERSION
  };
}

const seedItems: PublicSiteItem[] = [
  {
    id: "site-landing",
    title: "האתר הציבורי של בת-אל פרץ",
    slug: "/",
    pageType: "landing",
    status: "published",
    summary:
      "עמוד הבית הציבורי של בת-אל פרץ, מטפלת באמנות המציעה טיפול רגשי לילדים ונוער בדימונה, בסטודיו 'להיות' וגם אונליין.",
    contentJson: withVersion({
      sections: ["hero", "about-snippet", "therapy-areas", "featured-pages", "contact-cta"],
      heroDescription:
        "אני בת-אל פרץ, מטפלת באמנות, מלווה ילדים ונוער בהתמודדות עם קשיים רגשיים והתפתחותיים מתוך גישה ישירה ומכילה. הטיפול מתקיים בדימונה, במת״יא דימונה, בסטודיו הפרטי 'להיות' וגם אונליין.",
      heroImagePath: "/public-site/bat-el-peretz.jpeg",
      heroImageAlt: "בת-אל פרץ",
      aboutHighlights: [
        "בת-אל פרץ, מטפלת באמנות המתמחה בטיפול רגשי לילדים ונוער.",
        "עובדת במת״יא דימונה ומטפלת גם בסטודיו הפרטי 'להיות' בדימונה.",
        "מציעה גם מפגשי אונליין להורים, לילדים ולבני נוער."
      ],
      therapyAreas: [
        {
          id: "emotional-children",
          title: "טיפול רגשי לילדים",
          description:
            "טיפול רגשי לילדים סביב חרדה, קשיי ויסות, מעברים, פרידות, אובדן ומשברי חיים, בדימונה וגם אונליין לפי הצורך."
        },
        {
          id: "art-therapy",
          title: "טיפול באמנות",
          description:
            "טיפול באמנות באמצעות יצירה, דימוי וחומר כדי לאפשר ביטוי רגשי גם כשקשה לדבר במילים."
        },
        {
          id: "parent-guidance",
          title: "הדרכת הורים",
          description:
            "הדרכת הורים ממוקדת שמסייעת להבין את הילד, להגיב באופן מותאם ולבנות רצף בין הבית, הטיפול והמסגרת החינוכית."
        },
        {
          id: "autism-spectrum",
          title: "עבודה עם ילדים על הספקטרום האוטיסטי",
          description:
            "עבודה עם ילדים על הספקטרום האוטיסטי תוך התאמת המרחב הטיפולי לצרכים חושיים, תקשורתיים ורגשיים מתוך גישה יציבה ומכבדת."
        },
        {
          id: "developmental-delay",
          title: "ילדים עם עיכוב התפתחותי",
          description:
            "ליווי לילדים עם עיכוב התפתחותי המשלב מבט רגשי, התפתחותי ומשפחתי, בדימונה או אונליין לפי הצורך."
        }
      ]
    }),
    htmlContent: null,
    externalPath: null,
    externalUrl: "https://batel.art-therapy.example",
    servedPath: null,
    servedUrl: null,
    sourceType: null,
    serveMode: null,
    seoTitle: "טיפול רגשי לילדים בדימונה – בת-אל פרץ",
    seoDescription:
      "בת-אל פרץ היא מטפלת באמנות המציעה טיפול רגשי לילדים, טיפול באמנות, הדרכת הורים וליווי בדימונה, במת״יא דימונה, בסטודיו 'להיות' וגם אונליין.",
    publishedAt: "2026-04-01T09:00:00.000Z",
    updatedAt: nowIso(),
    featured: true
  },
  {
    id: "site-about",
    title: "אודות בת-אל פרץ",
    slug: "/about",
    pageType: "content_page",
    status: "published",
    summary:
      "בת-אל פרץ היא מטפלת באמנות המלווה ילדים, בני נוער והורים בטיפול רגשי לילדים מתוך גישה ישירה, מכילה ומשתפת.",
    contentJson: withVersion({
      sections: ["bio", "approach", "parents", "locations"],
      paragraphs: [
        "בת-אל פרץ היא מטפלת באמנות המתמחה בטיפול רגשי לילדים ולבני נוער בגילאי 4–20 בהתמודדות עם קשיים רגשיים, התפתחותיים וחברתיים.",
        "בת-אל עובדת במת״יא דימונה ומטפלת גם באופן פרטי בסטודיו 'להיות'. הטיפול מתקיים גם בסטודיו הפרטי 'להיות' — מרחב טיפולי בטוח, אישי ויצירתי.",
        "העבודה כוללת גם ליווי לילדים על הספקטרום האוטיסטי ולילדים עם עיכוב התפתחותי, מתוך התאמה רגשית, חושית ומשפחתית.",
        "העבודה הטיפולית מבוססת על גישה ישירה ומכילה, שמחזיקה את הילד ואת המשפחה יחד. בת-אל רואה בשיתוף פעולה עם הורים חלק מהותי בתהליך.",
        "לצד המפגשים הפרונטליים בדימונה, קיימת גם אפשרות למפגשי אונליין במידת הצורך."
      ]
    }),
    htmlContent: null,
    externalPath: null,
    externalUrl: null,
    servedPath: null,
    servedUrl: null,
    sourceType: null,
    serveMode: null,
    seoTitle: "אודות בת-אל פרץ | מטפלת באמנות בדימונה",
    seoDescription:
      "בת-אל פרץ, מטפלת באמנות בדימונה, מציעה טיפול רגשי לילדים, עבודה עם ילדים על הספקטרום האוטיסטי, ליווי לילדים עם עיכוב התפתחותי וגם טיפול אונליין.",
    publishedAt: "2026-04-02T09:00:00.000Z",
    updatedAt: nowIso()
  },
  {
    id: "site-contact",
    title: "יצירת קשר",
    slug: "/contact",
    pageType: "contact_page",
    status: "published",
    summary:
      "אפשר ליצור קשר עם בת-אל לשיחת היכרות, לשאלות הורים ולפניות של מסגרות חינוך.",
    contentJson: withVersion({
      sections: ["contact-options", "locations", "forms"],
      phone: "052-6326430",
      email: "artbatel@gmail.com",
      location:
        "דימונה — מת״יא דימונה ובסטודיו הפרטי 'להיות'\nוכן אפשרות לטיפול אונליין",
      body: [
        "אפשר ליצור קשר טלפונית, במייל או דרך הטפסים הציבוריים באתר.",
        "הטיפול זמין לילדים, לבני נוער ולהורים, בתיאום אישי ומתוך התאמה למסגרת ולצרכים של המשפחה."
      ]
    }),
    htmlContent: null,
    externalPath: null,
    externalUrl: null,
    servedPath: null,
    servedUrl: null,
    sourceType: null,
    serveMode: null,
    seoTitle: "יצירת קשר עם בת-אל פרץ",
    seoDescription:
      "יצירת קשר עם בת-אל פרץ, מטפלת באמנות בדימונה: מת״יא דימונה, הסטודיו הפרטי 'להיות', וגם אפשרות לטיפול אונליין.",
    publishedAt: "2026-04-02T12:00:00.000Z",
    updatedAt: nowIso(),
    featured: true
  },
  {
    id: "public-emergency",
    title: "מדריך עזרה ראשונה רגשית",
    slug: "/emergency",
    pageType: "resource_page",
    status: "published",
    summary:
      "מדריך התמודדות ראשוני להורים במצבי חירום, חרדה או עומס רגשי בבית.",
    contentJson: withVersion({
      sections: ["signals", "first-response", "when-to-contact"],
      paragraphs: [
        "המדריך מרכז עקרונות ראשוניים להתנהלות עם ילדים בזמן מצוקה רגשית, הצפה או חרדה.",
        "הוא אינו מחליף טיפול, אך יכול לעזור להורה לעצור, לווסת ולבחור תגובה בטוחה ומכילה."
      ]
    }),
    htmlContent: null,
    externalPath: null,
    externalUrl: null,
    servedPath: null,
    servedUrl: null,
    sourceType: null,
    serveMode: null,
    seoTitle: "מדריך עזרה ראשונה רגשית",
    seoDescription:
      "מדריך ראשוני להורים להתמודדות עם חרדה, הצפה רגשית ומצבי חירום בבית.",
    publishedAt: "2026-04-03T08:30:00.000Z",
    updatedAt: nowIso(),
    featured: false
  },
  {
    id: "public-parents",
    title: "תמיכה והדרכת הורים",
    slug: "/parent-guidance",
    pageType: "content_page",
    status: "published",
    summary:
      "תוכן להורים שמחבר בין טיפול רגשי לילדים לבין מה שקורה בבית, בשגרה וברגעי עומס.",
    contentJson: withVersion({
      sections: ["expectations", "home-support", "faq"],
      paragraphs: [
        "הדרכת הורים היא חלק משמעותי בתהליך הטיפולי: היא עוזרת להבין מה הילד מבטא, מה הוא צריך ומה יכול לתמוך בו בבית כחלק מטיפול רגשי לילדים.",
        "הגישה של בת-אל ישירה ומכילה: מסתכלים יחד על ההתנהגות, על הרגש שמאחוריה ועל מה שאפשר לעשות בפועל בבית, בדימונה וגם במפגשי אונליין."
      ]
    }),
    htmlContent: null,
    externalPath: null,
    externalUrl: null,
    servedPath: null,
    servedUrl: null,
    sourceType: null,
    serveMode: null,
    seoTitle: "הדרכת הורים | טיפול רגשי לילדים בדימונה",
    seoDescription:
      "תוכן ותמיכה להורים כחלק מטיפול רגשי לילדים, טיפול באמנות וליווי משפחתי בדימונה וגם אונליין.",
    publishedAt: "2026-04-03T08:30:00.000Z",
    updatedAt: nowIso(),
    featured: true
  },
  {
    id: "external-art-therapy-site",
    title: "מדריך חירום ותמיכה להורים",
    slug: "/external/art-therapy-website",
    pageType: "external_html",
    status: "published",
    summary:
      "נכס HTML חיצוני שמרכז הדרכה ראשונית להורים במצבי חירום, ונפתח מתוך האתר הציבורי של בת-אל.",
    contentJson: withVersion({
      sourceKind: "local-html-project",
      previewAvailable: true,
      linkedFromHub: true
    }),
    htmlContent: null,
    externalPath: EXTERNAL_WEBSITE_FILE,
    externalUrl: null,
    servedPath: ART_THERAPY_WEBSITE_SERVED_PATH,
    servedUrl: null,
    sourceType: "single_html_file",
    serveMode: "backend_route",
    seoTitle: "מדריך חירום להורים",
    seoDescription:
      "משאב HTML חיצוני בניהול BATEL עם מידע ראשוני ותמיכה להורים.",
    publishedAt: "2026-04-04T10:00:00.000Z",
    updatedAt: nowIso(),
    featured: true
  }
];

const seedForms: PublicFormDefinition[] = [
  {
    id: "form-contact",
    title: "טופס יצירת קשר",
    slug: "/forms/contact",
    formType: "contact",
    status: "published",
    summary:
      "פנייה ראשונית קצרה אל בת-אל לשאלות, התייעצות או תיאום שיחה.",
    linkedPageId: "site-contact",
    destinationLabel: "מייל ישיר",
    destinationEmail: "artbatel@gmail.com",
    successMessage: "הפנייה התקבלה. בת-אל תחזור אליכם בהקדם.",
    updatedAt: nowIso()
  },
  {
    id: "form-consultation",
    title: "בקשת שיחת היכרות",
    slug: "/forms/consultation",
    formType: "consultation",
    status: "published",
    summary:
      "טופס לתיאום שיחת היכרות ראשונית לגבי טיפול לילד, לנער או להדרכת הורים.",
    linkedPageId: "site-contact",
    destinationLabel: "יומן תיאום",
    destinationEmail: "artbatel@gmail.com",
    successMessage: "הבקשה נקלטה. נחזור לתיאום שיחת היכרות.",
    updatedAt: nowIso()
  },
  {
    id: "form-parent",
    title: "פניית הורה",
    slug: "/forms/parent-inquiry",
    formType: "parent_inquiry",
    status: "published",
    summary:
      "פנייה ייעודית להורים המבקשים הכוונה, בירור או הדרכה.",
    linkedPageId: "public-parents",
    destinationLabel: "תיבת פניות הורים",
    destinationEmail: "artbatel@gmail.com",
    successMessage: "תודה, פנייתכם נקלטה ונחזור אליכם בהקדם.",
    updatedAt: nowIso()
  },
  {
    id: "form-school",
    title: "פניית מסגרת חינוכית",
    slug: "/forms/school-inquiry",
    formType: "school_inquiry",
    status: "published",
    summary:
      "פנייה לצוותי חינוך, יועצות ואנשי מקצוע המעוניינים בהתייעצות או בליווי.",
    linkedPageId: "site-contact",
    destinationLabel: "פניות ממסגרות",
    destinationEmail: "artbatel@gmail.com",
    successMessage: "הפנייה נקלטה ונחזור עם פרטי המשך.",
    updatedAt: nowIso()
  }
];

const seedMainWebsite: MainWebsiteSettings = {
  siteTitle: "בת-אל פרץ | טיפול רגשי לילדים בדימונה",
  siteUrl: "https://batel.art-therapy.example",
  tagline: "טיפול באמנות לילדים ונוער בגילאי 4–20",
  heroTitle: "טיפול רגשי לילדים בדימונה – בת-אל פרץ",
  heroSubtitle: "טיפול באמנות לילדים ונוער בגילאי 4–20",
  primaryCtaLabel: "קבעו שיחת היכרות",
  primaryCtaTargetId: "form-consultation",
  secondaryCtaLabel: "קראו על הטיפול",
  secondaryCtaTargetId: "site-about",
  contactPageId: "site-contact",
  featuredPageIds: ["public-parents", "external-art-therapy-site", "form-contact"],
  navigation: [
    { id: "nav-home", label: "דף הבית", targetType: "page", targetId: "site-landing", isPrimary: true },
    { id: "nav-about", label: "אודות", targetType: "page", targetId: "site-about", isPrimary: true },
    { id: "nav-parents", label: "הדרכת הורים", targetType: "page", targetId: "public-parents", isPrimary: true },
    { id: "nav-contact", label: "יצירת קשר", targetType: "page", targetId: "site-contact", isPrimary: true },
    { id: "nav-consultation", label: "שיחת היכרות", targetType: "form", targetId: "form-consultation", isPrimary: false },
    { id: "nav-external", label: "מדריך חירום", targetType: "external", targetId: "external-art-therapy-site", isPrimary: false }
  ],
  updatedAt: nowIso()
};

const seedState: PublicSiteManagerState = {
  mainWebsite: seedMainWebsite,
  items: seedItems,
  forms: seedForms
};

function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function looksCorrupted(value: unknown): boolean {
  if (typeof value === "string") {
    return value.includes("ג€") || value.includes("\uFFFD") || /׳[\u0590-\u05FFA-Za-z0-9]/.test(value);
  }

  if (Array.isArray(value)) {
    return value.some(looksCorrupted);
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(looksCorrupted);
  }

  return false;
}

function extractVersion(value: unknown) {
  if (!value || typeof value !== "object") {
    return "";
  }
  return String((value as Record<string, unknown>).contentVersion ?? "");
}

function shouldRefreshItemFromSeed(item: PublicSiteItem, fallback: PublicSiteItem) {
  if (looksCorrupted(item)) {
    return true;
  }

  return extractVersion(item.contentJson) !== extractVersion(fallback.contentJson);
}

function shouldRefreshMainWebsite(mainWebsite: MainWebsiteSettings) {
  return (
    looksCorrupted(mainWebsite) ||
    mainWebsite.heroTitle !== seedMainWebsite.heroTitle ||
    mainWebsite.tagline !== seedMainWebsite.tagline ||
    mainWebsite.primaryCtaLabel !== seedMainWebsite.primaryCtaLabel ||
    mainWebsite.secondaryCtaLabel !== seedMainWebsite.secondaryCtaLabel
  );
}

function mergeSeedItem(fallback: PublicSiteItem, current?: PublicSiteItem) {
  if (!current) {
    return { ...fallback };
  }

  if (shouldRefreshItemFromSeed(current, fallback)) {
    return {
      ...fallback,
      status: current.status ?? fallback.status,
      publishedAt: current.publishedAt ?? fallback.publishedAt,
      updatedAt: nowIso(),
      featured: current.featured ?? fallback.featured
    };
  }

  return {
    ...fallback,
    ...current
  };
}

function mergeSeedForm(fallback: PublicFormDefinition, current?: PublicFormDefinition) {
  if (!current || looksCorrupted(current)) {
    return { ...fallback };
  }

  return {
    ...fallback,
    ...current
  };
}

function normalizeState(state: PublicSiteManagerState): PublicSiteManagerState {
  const fallback = cloneState(seedState);
  const itemsById = new Map(state.items.map((item) => [item.id, item]));
  const formsById = new Map(state.forms.map((form) => [form.id, form]));

  const normalizedItems = fallback.items.map((item) => mergeSeedItem(item, itemsById.get(item.id)));
  const normalizedForms = fallback.forms.map((form) => mergeSeedForm(form, formsById.get(form.id)));
  const normalizedMainWebsite = shouldRefreshMainWebsite(state.mainWebsite)
    ? {
        ...fallback.mainWebsite,
        updatedAt: nowIso()
      }
    : {
        ...fallback.mainWebsite,
        ...state.mainWebsite,
        navigation: state.mainWebsite.navigation?.length ? state.mainWebsite.navigation : fallback.mainWebsite.navigation,
        featuredPageIds: state.mainWebsite.featuredPageIds?.length
          ? state.mainWebsite.featuredPageIds
          : fallback.mainWebsite.featuredPageIds
      };

  return {
    mainWebsite: normalizedMainWebsite,
    items: normalizedItems,
    forms: normalizedForms
  };
}

function loadState(): PublicSiteManagerState {
  if (typeof window === "undefined") {
    return cloneState(seedState);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return cloneState(seedState);
  }

  try {
    const parsed = JSON.parse(raw) as PublicSiteManagerState;
    const nextState = normalizeState({
      mainWebsite: parsed.mainWebsite ?? cloneState(seedMainWebsite),
      items: parsed.items ?? cloneState(seedItems),
      forms: parsed.forms ?? cloneState(seedForms)
    });
    persistState(nextState);
    return nextState;
  } catch {
    return cloneState(seedState);
  }
}

function persistState(state: PublicSiteManagerState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateStatus<T extends { status: PublicSiteItemStatus; publishedAt?: string | null; updatedAt: string }>(
  item: T,
  status: PublicSiteItemStatus
) {
  return {
    ...item,
    status,
    publishedAt: status === "published" ? item.publishedAt ?? nowIso() : null,
    updatedAt: nowIso()
  };
}

export const publicSiteService = {
  getState() {
    return loadState();
  },

  saveState(nextState: PublicSiteManagerState) {
    persistState(nextState);
    return cloneState(nextState);
  },

  updateMainWebsite(patch: Partial<MainWebsiteSettings>) {
    const current = loadState();
    const nextState: PublicSiteManagerState = {
      ...current,
      mainWebsite: {
        ...current.mainWebsite,
        ...patch,
        updatedAt: nowIso()
      }
    };
    persistState(nextState);
    return cloneState(nextState);
  },

  updateItem(itemId: string, patch: Partial<PublicSiteItem>) {
    const current = loadState();
    const fallbackItem = seedItems.find((item) => item.id === itemId);
    const nextState: PublicSiteManagerState = {
      ...current,
      items: current.items.map((item) =>
        item.id === itemId
          ? {
              ...(fallbackItem ? mergeSeedItem(fallbackItem, item) : item),
              ...patch,
              updatedAt: nowIso()
            }
          : item
      )
    };
    persistState(nextState);
    return cloneState(nextState);
  },

  updateForm(formId: string, patch: Partial<PublicFormDefinition>) {
    const current = loadState();
    const fallbackForm = seedForms.find((form) => form.id === formId);
    const nextState: PublicSiteManagerState = {
      ...current,
      forms: current.forms.map((form) =>
        form.id === formId
          ? {
              ...(fallbackForm ? mergeSeedForm(fallbackForm, form) : form),
              ...patch,
              updatedAt: nowIso()
            }
          : form
      )
    };
    persistState(nextState);
    return cloneState(nextState);
  },

  publishItem(itemId: string) {
    const current = loadState();
    const nextState: PublicSiteManagerState = {
      ...current,
      items: current.items.map((item) => (item.id === itemId ? updateStatus(item, "published") : item))
    };
    persistState(nextState);
    return cloneState(nextState);
  },

  unpublishItem(itemId: string) {
    const current = loadState();
    const nextState: PublicSiteManagerState = {
      ...current,
      items: current.items.map((item) => (item.id === itemId ? updateStatus(item, "draft") : item))
    };
    persistState(nextState);
    return cloneState(nextState);
  },

  archiveItem(itemId: string) {
    const current = loadState();
    const nextState: PublicSiteManagerState = {
      ...current,
      items: current.items.map((item) => (item.id === itemId ? updateStatus(item, "archived") : item))
    };
    persistState(nextState);
    return cloneState(nextState);
  },

  setFeaturedPages(pageIds: string[]) {
    return this.updateMainWebsite({ featuredPageIds: pageIds });
  },

  reset() {
    persistState(seedState);
    return cloneState(seedState);
  }
};
