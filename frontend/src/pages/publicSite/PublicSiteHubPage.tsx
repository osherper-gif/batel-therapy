import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "../../design-system/Badge";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Icon } from "../../design-system/Icon";
import type { IconName } from "../../design-system/Icon";
import { publicSiteService } from "../../services/publicSiteService";
import {
  getFeaturedTargets,
  getMainPublicSiteHref,
  getPublicFormHref,
  getPublicSiteItemHref,
  getVisibleNavigationTargets
} from "../../services/publicSiteLinks";
import type { PublicFormDefinition, PublicSiteItem, PublicSiteManagerState } from "../../types";

type TherapyAreaContent = {
  id: string;
  title: string;
  description: string;
};

function getPreviewMode(search: string) {
  return new URLSearchParams(search).get("preview") === "1";
}

function getPathRemainder(pathname: string) {
  if (!pathname.startsWith("/site")) {
    return "/";
  }
  const remainder = pathname.slice("/site".length);
  return remainder || "/";
}

function statusLabel(status: "draft" | "published" | "archived") {
  if (status === "published") return "מפורסם";
  if (status === "archived") return "מוסתר";
  return "תצוגת טיוטה";
}

function toneForStatus(status: "draft" | "published" | "archived") {
  if (status === "published") return "sage" as const;
  if (status === "archived") return "muted" as const;
  return "clay" as const;
}

function sectionTitles(sections: unknown) {
  if (!Array.isArray(sections)) {
    return [] as string[];
  }
  return sections.map((value) => String(value));
}

function textList(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }
  return value.map((entry) => String(entry)).filter(Boolean);
}

function therapyAreasFromContent(value: unknown): TherapyAreaContent[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((entry) => entry && typeof entry === "object")
    .map((entry, index) => {
      const data = entry as Record<string, unknown>;
      return {
        id: String(data.id ?? `therapy-${index}`),
        title: String(data.title ?? ""),
        description: String(data.description ?? "")
      };
    })
    .filter((entry) => entry.title && entry.description);
}

function findPublicPage(state: PublicSiteManagerState, pathRemainder: string, preview: boolean) {
  const normalized = pathRemainder === "/" ? "/" : pathRemainder.replace(/\/$/, "");
  const item = state.items.find((entry) => entry.pageType !== "external_html" && entry.slug === normalized);
  if (!item) {
    return null;
  }
  const href = getPublicSiteItemHref(item, preview);
  return href ? item : null;
}

function findPublicForm(state: PublicSiteManagerState, pathRemainder: string, preview: boolean) {
  const normalized = pathRemainder === "/" ? "/" : pathRemainder.replace(/\/$/, "");
  const form = state.forms.find((entry) => entry.slug === normalized);
  if (!form) {
    return null;
  }
  const href = getPublicFormHref(form, preview);
  return href ? form : null;
}

function PublicLink({
  href,
  children,
  className,
  dataTestId
}: {
  href: string;
  children: ReactNode;
  className?: string;
  dataTestId?: string;
}) {
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} className={className} data-testid={dataTestId} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className} data-testid={dataTestId}>
      {children}
    </Link>
  );
}

type NavMode = "hub" | "inner";

function TherapistHeader({
  state,
  preview,
  mode
}: {
  state: PublicSiteManagerState;
  preview: boolean;
  mode: NavMode;
}) {
  const homeHref = getMainPublicSiteHref(preview);
  const navItems = getVisibleNavigationTargets(state, preview);

  return (
    <header className="ts-header" id="top">
      <div className="ts-header__inner">
        <Link to={homeHref} className="ts-brand" aria-label="חזרה לדף הבית">
          <span className="ts-brand__mark" aria-hidden="true">ב</span>
          <span className="ts-brand__text">
            <span className="ts-brand__title">{state.mainWebsite.siteTitle}</span>
            <span className="ts-brand__subtitle">{state.mainWebsite.tagline}</span>
          </span>
        </Link>
        <nav className="ts-nav" aria-label="ניווט ראשי">
          {navItems.map((entry) => {
            if (mode === "hub" && !/^https?:\/\//i.test(entry.href)) {
              return (
                <PublicLink
                  key={entry.id}
                  href={entry.href}
                  className="ts-nav__link"
                  dataTestId={`public-site-nav-${entry.id}`}
                >
                  {entry.label}
                </PublicLink>
              );
            }

            return (
              <PublicLink
                key={entry.id}
                href={entry.href}
                className="ts-nav__link"
                dataTestId={`public-site-nav-${entry.id}`}
              >
                {entry.label}
              </PublicLink>
            );
          })}
        </nav>
        <div className="ts-header__aside">
          {preview ? <Badge tone="clay">תצוגת טיוטה</Badge> : null}
          <a href="#contact" className="ts-header__cta">
            <Icon name="messageCircle" size={14} /> {state.mainWebsite.primaryCtaLabel}
          </a>
        </div>
      </div>
    </header>
  );
}

function TherapistFooter() {
  return (
    <footer className="ts-footer">
      <div className="ts-footer__inner">
        <div className="ts-footer__brand">
          <strong>בת-אל פרץ · מטפלת באמנות</strong>
          <span className="ts-footer__muted">דימונה · מת״יא דימונה · הסטודיו הפרטי "להיות" · טיפול אונליין</span>
        </div>
        <div className="ts-footer__meta">
          <a href="mailto:artbatel@gmail.com">artbatel@gmail.com</a>
          <a href="tel:0526326430">052-6326430</a>
        </div>
        <div className="ts-footer__fine">© {new Date().getFullYear()} · כל הזכויות שמורות</div>
      </div>
    </footer>
  );
}

function PublicSiteLayout({
  state,
  preview,
  mode,
  children
}: {
  state: PublicSiteManagerState;
  preview: boolean;
  mode: NavMode;
  children: ReactNode;
}) {
  return (
    <div className="ts-site" dir="rtl">
      <TherapistHeader state={state} preview={preview} mode={mode} />
      <main className="ts-main">{children}</main>
      <TherapistFooter />
    </div>
  );
}

function upsertMetaTag(name: string, content: string, attribute: "name" | "property" = "name") {
  if (typeof document === "undefined") {
    return;
  }

  let element = document.head.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonicalLink(href: string) {
  if (typeof document === "undefined") {
    return;
  }

  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function usePublicSeo(title: string, description: string, keywords: string, canonicalUrl: string) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = title;
    upsertMetaTag("description", description);
    upsertMetaTag("keywords", keywords);
    upsertMetaTag("og:title", title, "property");
    upsertMetaTag("og:description", description, "property");
    upsertMetaTag("og:url", canonicalUrl, "property");
    upsertCanonicalLink(canonicalUrl);
  }, [title, description, keywords, canonicalUrl]);
}

function Hero({ state, preview }: { state: PublicSiteManagerState; preview: boolean }) {
  const landingItem = state.items.find((item) => item.id === "site-landing");
  const heroDescription = String(landingItem?.contentJson?.heroDescription ?? "");
  const heroImagePath =
    typeof landingItem?.contentJson?.heroImagePath === "string" ? landingItem.contentJson.heroImagePath : "";
  const heroImageAlt =
    typeof landingItem?.contentJson?.heroImageAlt === "string" ? landingItem.contentJson.heroImageAlt : "בת-אל פרץ";
  const aboutHighlights = textList(landingItem?.contentJson?.aboutHighlights);
  const primaryHref = getPublicFormHref(
    state.forms.find((form) => form.id === state.mainWebsite.primaryCtaTargetId) ?? state.forms[0],
    preview
  );
  const secondaryTarget = state.items.find((item) => item.id === state.mainWebsite.secondaryCtaTargetId);
  const secondaryHref = secondaryTarget ? getPublicSiteItemHref(secondaryTarget, preview) : "#about";

  return (
    <section className="ts-hero">
      <div className="ts-hero__bg" aria-hidden="true">
        <span className="ts-hero__blob ts-hero__blob--sage" />
        <span className="ts-hero__blob ts-hero__blob--clay" />
        <span className="ts-hero__blob ts-hero__blob--lavender" />
      </div>
      <div className="ts-hero__grid">
        <div className="ts-hero__text">
          <div className="ts-hero__eyebrow">
            <Icon name="heart" size={14} /> מטפלת באמנות · ילדים ונוער · גילאי 4–20
          </div>
          <h1 data-testid="public-site-hub-title" className="ts-hero__title">
            {state.mainWebsite.heroTitle}
          </h1>
          <p className="ts-hero__lede" style={{ fontWeight: 600 }}>
            {state.mainWebsite.heroSubtitle}
          </p>
          <p className="ts-hero__lede">{heroDescription || state.mainWebsite.heroSubtitle}</p>
          <div className="ts-hero__ctas">
            <PublicLink
              href={primaryHref || "#contact"}
              className="ts-btn ts-btn--primary"
              dataTestId="public-site-primary-cta"
            >
              {state.mainWebsite.primaryCtaLabel}
            </PublicLink>
            <PublicLink
              href={secondaryHref || "#about"}
              className="ts-btn ts-btn--ghost"
              dataTestId="public-site-secondary-cta"
            >
              {state.mainWebsite.secondaryCtaLabel}
            </PublicLink>
          </div>
          <ul className="ts-hero__trust">
            {aboutHighlights.map((item) => (
              <li key={item}>
                <Icon name="checkCircle" size={14} /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="ts-hero__visual" aria-hidden="true">
          <div className="ts-portrait">
            <div className="ts-portrait__frame">
              {heroImagePath ? (
                <>
                  <div className="ts-portrait__ring" />
                  <img
                    data-testid="public-site-hero-image"
                    src={heroImagePath}
                    alt={heroImageAlt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "inherit",
                      display: "block",
                      position: "relative",
                      zIndex: 1
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="ts-portrait__ring" />
                  <div className="ts-portrait__initial">ב</div>
                  <div className="ts-portrait__palette">
                    <span className="ts-portrait__dot ts-portrait__dot--sage" />
                    <span className="ts-portrait__dot ts-portrait__dot--clay" />
                    <span className="ts-portrait__dot ts-portrait__dot--lavender" />
                  </div>
                </>
              )}
            </div>
            <div className="ts-portrait__tag">
              <Icon name="palette" size={14} />
              <span>מת״יא דימונה · הסטודיו הפרטי "להיות"</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About({ state }: { state: PublicSiteManagerState }) {
  const aboutItem = state.items.find((item) => item.id === "site-about");
  const paragraphs = textList(aboutItem?.contentJson?.paragraphs);

  return (
    <section className="ts-section" id="about">
      <div className="ts-section__head">
        <span className="ts-section__eyebrow">אודות</span>
        <h2 className="ts-section__title">{aboutItem?.title || "אודות בת-אל"}</h2>
        <p className="ts-section__lede">{aboutItem?.summary}</p>
      </div>
      <div className="ts-about">
        <div className="ts-about__body">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={index === paragraphs.length - 1 ? "ts-about__pull" : undefined}>
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="ts-credentials" aria-label="מקומות עבודה ואופן הטיפול">
          <h3 className="ts-credentials__title">מקומות הטיפול</h3>
          <ul className="ts-credentials__list">
            <li>
              <span className="ts-credentials__year">היום</span>
              <div>
                <strong>מת״יא דימונה</strong>
                <span>ליווי רגשי-טיפולי במסגרות חינוכיות ובקהילה</span>
              </div>
            </li>
            <li>
              <span className="ts-credentials__year">פרטי</span>
              <div>
                <strong>הסטודיו "להיות"</strong>
                <span>מרחב טיפולי בטוח, אישי ויצירתי לילדים, לנוער ולהורים</span>
              </div>
            </li>
            <li>
              <span className="ts-credentials__year">אונליין</span>
              <div>
                <strong>מפגשים מרחוק</strong>
                <span>אפשרות לטיפול ולהדרכת הורים גם בזום או בשיחת וידאו</span>
              </div>
            </li>
          </ul>
          <div className="ts-credentials__foot">
            <Icon name="sparkles" size={14} />
            <span>גישה ישירה ומכילה, בשיתוף פעולה רציף עם הורים כשצריך.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

const THERAPY_AREA_ICONS: IconName[] = ["heart", "palette", "users", "sparkles", "bookmark"];
const THERAPY_AREA_TONES = ["sage", "clay", "lavender", "info", "warning"] as const;

function TherapyAreas({ state }: { state: PublicSiteManagerState }) {
  const landingItem = state.items.find((item) => item.id === "site-landing");
  const areas = therapyAreasFromContent(landingItem?.contentJson?.therapyAreas);

  return (
    <section className="ts-band" id="therapies">
      <div className="ts-band__inner">
        <div className="ts-section__head">
          <span className="ts-section__eyebrow">תחומי טיפול</span>
          <h2 className="ts-section__title">איך הטיפול יכול לעזור</h2>
          <p className="ts-section__lede">
            הטיפול נבנה יחד עם הילד, המשפחה והמסגרת, מתוך הבנה שהקושי הרגשי פוגש גם התפתחות, קשרים וסביבה.
          </p>
        </div>
        <div className="ts-therapies">
          {areas.map((area, index) => (
            <article key={area.id} className={`ts-therapy ts-therapy--${THERAPY_AREA_TONES[index % THERAPY_AREA_TONES.length]}`}>
              <div className="ts-therapy__icon">
                <Icon name={THERAPY_AREA_ICONS[index % THERAPY_AREA_ICONS.length]} size={22} />
              </div>
              <h3 className="ts-therapy__title">{area.title}</h3>
              <p className="ts-therapy__body">{area.description}</p>
              <a href="#contact" className="ts-therapy__link">
                לשיחת היכרות <Icon name="arrowLeft" size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function iconForKind(kind: "page" | "form" | "external"): IconName {
  if (kind === "form") return "mail";
  if (kind === "external") return "link";
  return "fileText";
}

function labelForKind(kind: "page" | "form" | "external") {
  if (kind === "form") return "טופס פנייה";
  if (kind === "external") return "משאב חיצוני";
  return "עמוד תוכן";
}

function Resources({ state, preview }: { state: PublicSiteManagerState; preview: boolean }) {
  const featuredTargets = getFeaturedTargets(state, preview);

  return (
    <section className="ts-section" id="resources">
      <div className="ts-section__head">
        <span className="ts-section__eyebrow">משאבים</span>
        <h2 className="ts-section__title">תוכן ומשאבים פתוחים</h2>
        <p className="ts-section__lede">
          כאן אפשר למצוא גם את מדריך החירום החיצוני וגם תוכן שמיועד להורים, לפנייה וליצירת קשר.
        </p>
      </div>
      <div className="ts-resources">
        {featuredTargets.map((target) => (
          <PublicLink
            key={target.id}
            href={target.href}
            className="ts-resource"
            dataTestId={`public-site-feature-${target.id}`}
          >
            <div className="ts-resource__icon">
              <Icon name={iconForKind(target.kind)} size={18} />
            </div>
            <div className="ts-resource__body">
              <div className="ts-resource__kind">{labelForKind(target.kind)}</div>
              <h3 className="ts-resource__title">{target.title}</h3>
              <p className="ts-resource__summary">{target.summary}</p>
            </div>
            <span className="ts-resource__go" aria-hidden="true">
              <Icon name="arrowLeft" size={16} />
            </span>
          </PublicLink>
        ))}
      </div>
    </section>
  );
}

function Contact({ state, preview }: { state: PublicSiteManagerState; preview: boolean }) {
  const contactPage = state.items.find((item) => item.id === "site-contact");
  const contactBody = textList(contactPage?.contentJson?.body);
  const contactEmail = String(contactPage?.contentJson?.email ?? "artbatel@gmail.com");
  const contactPhone = String(contactPage?.contentJson?.phone ?? "052-6326430");
  const contactLocation = String(contactPage?.contentJson?.location ?? "");
  const contactForm =
    state.forms.find((form) => form.formType === "contact") ||
    state.forms.find((form) => form.formType === "parent_inquiry") ||
    state.forms[0];
  const contactHref = contactForm ? getPublicFormHref(contactForm, preview) : null;

  return (
    <section className="ts-band ts-band--contact" id="contact">
      <div className="ts-band__inner">
        <div className="ts-section__head">
          <span className="ts-section__eyebrow">יצירת קשר</span>
          <h2 className="ts-section__title">בואו נדבר</h2>
          <p className="ts-section__lede">{contactPage?.summary}</p>
        </div>
        <div className="ts-contact">
          <div className="ts-contact__card">
            <div className="ts-contact__row">
              <Icon name="mail" size={18} />
              <div>
                <div className="ts-contact__label">אימייל</div>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
            </div>
            <div className="ts-contact__row">
              <Icon name="phone" size={18} />
              <div>
                <div className="ts-contact__label">טלפון</div>
                <a href="tel:+972526326430">{contactPhone}</a>
              </div>
            </div>
            <div className="ts-contact__row">
              <Icon name="home" size={18} />
              <div>
                <div className="ts-contact__label">מיקום</div>
                <span style={{ whiteSpace: "pre-line" }}>{contactLocation}</span>
              </div>
            </div>
            <div className="ts-contact__note">
              <Icon name="heart" size={14} />
              <span>הטיפול מתקיים גם בסטודיו הפרטי "להיות" — מרחב טיפולי בטוח, אישי ויצירתי.</span>
            </div>
          </div>

          <div className="ts-contact__form">
            <h3>פנייה מהירה</h3>
            <p className="ts-contact__muted">{contactBody.join(" ")}</p>
            <ul className="ts-contact__points">
              <li>
                <Icon name="check" size={14} /> שיחת היכרות ראשונית
              </li>
              <li>
                <Icon name="check" size={14} /> עבודה במת״יא דימונה, בסטודיו "להיות" וגם אונליין
              </li>
              <li>
                <Icon name="check" size={14} /> קשר ישיר עם ההורים כחלק מהתהליך
              </li>
            </ul>
            {contactHref ? (
              <PublicLink
                href={contactHref}
                className="ts-btn ts-btn--primary"
                dataTestId="public-site-contact-form"
              >
                פתחי את טופס הפנייה
              </PublicLink>
            ) : (
              <button type="button" className="ts-btn ts-btn--primary" disabled>
                הטופס ייפתח בקרוב
              </button>
            )}
            <div className="ts-contact__altline">
              או ישירות ב-
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicSiteHub({ state, preview }: { state: PublicSiteManagerState; preview: boolean }) {
  return (
    <PublicSiteLayout state={state} preview={preview} mode="hub">
      <Hero state={state} preview={preview} />
      <About state={state} />
      <TherapyAreas state={state} />
      <Resources state={state} preview={preview} />
      <Contact state={state} preview={preview} />
    </PublicSiteLayout>
  );
}

function PublicContentPage({
  state,
  preview,
  item
}: {
  state: PublicSiteManagerState;
  preview: boolean;
  item: PublicSiteItem;
}) {
  const sections = useMemo(() => sectionTitles(item.contentJson?.sections), [item.contentJson]);
  const paragraphs = useMemo(() => textList(item.contentJson?.paragraphs), [item.contentJson]);
  const linkedForms = state.forms.filter(
    (form) => form.linkedPageId === item.id && getPublicFormHref(form, preview)
  );

  return (
    <PublicSiteLayout state={state} preview={preview} mode="inner">
      <article className="ts-inner">
        <PublicLink href={getMainPublicSiteHref(preview)} className="ts-back-link">
          <Icon name="arrowRight" size={14} /> חזרה לדף הבית
        </PublicLink>
        <header className="ts-inner__head">
          <span className="ts-section__eyebrow">עמוד ציבורי</span>
          <h1 data-testid="public-site-page-title" className="ts-inner__title">
            {item.title}
          </h1>
          {item.summary ? <p className="ts-inner__lede">{item.summary}</p> : null}
          <div className="ts-inner__meta">
            <Badge tone={toneForStatus(item.status)}>{statusLabel(item.status)}</Badge>
          </div>
        </header>

        <div className="ts-inner__body">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <p>{item.seoDescription || item.summary}</p>
          )}

          {sections.length > 0 ? (
            <div className="ts-inner__sections">
              {sections.map((section) => (
                <Card key={section} variant="muted">
                  <CardBody>
                    <strong>{section}</strong>
                    <p className="ds-t-muted" style={{ marginTop: 8 }}>
                      זהו אזור תוכן פעיל מתוך העמוד "{item.title}".
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : null}
        </div>

        {linkedForms.length > 0 ? (
          <aside className="ts-inner__forms">
            <Card>
              <CardHeader title="טפסים זמינים" subtitle="אפשר להמשיך מכאן ישירות לטופס המתאים." />
              <CardBody compact>
                <div className="ds-row" style={{ gap: 8, flexWrap: "wrap" }}>
                  {linkedForms.map((form) => (
                    <PublicLink
                      key={form.id}
                      href={getPublicFormHref(form, preview)}
                      className="ts-btn ts-btn--ghost ts-btn--sm"
                    >
                      {form.title}
                    </PublicLink>
                  ))}
                </div>
              </CardBody>
            </Card>
          </aside>
        ) : null}
      </article>
    </PublicSiteLayout>
  );
}

function PublicFormPage({
  state,
  preview,
  form
}: {
  state: PublicSiteManagerState;
  preview: boolean;
  form: PublicFormDefinition;
}) {
  return (
    <PublicSiteLayout state={state} preview={preview} mode="inner">
      <article className="ts-inner">
        <PublicLink href={getMainPublicSiteHref(preview)} className="ts-back-link">
          <Icon name="arrowRight" size={14} /> חזרה לדף הבית
        </PublicLink>
        <header className="ts-inner__head">
          <span className="ts-section__eyebrow">טופס פנייה</span>
          <h1 data-testid="public-site-form-title" className="ts-inner__title">
            {form.title}
          </h1>
          {form.summary ? <p className="ts-inner__lede">{form.summary}</p> : null}
          <div className="ts-inner__meta">
            <Badge tone={toneForStatus(form.status)}>{statusLabel(form.status)}</Badge>
          </div>
        </header>

        <div className="ts-inner__body">
          <p>{form.successMessage}</p>
          <div className="ts-inner__formgrid">
            <div>
              <div className="ts-contact__label">הפנייה תישלח אל</div>
              <strong>{form.destinationLabel}</strong>
            </div>
            <div>
              <div className="ts-contact__label">כתובת אימייל</div>
              <a
                href={`mailto:${form.destinationEmail}?subject=${encodeURIComponent(form.title)}`}
                data-testid="public-site-form-email-link"
              >
                {form.destinationEmail}
              </a>
            </div>
          </div>
        </div>
      </article>
    </PublicSiteLayout>
  );
}

function PublicNotAvailable({ state, preview }: { state: PublicSiteManagerState; preview: boolean }) {
  return (
    <PublicSiteLayout state={state} preview={preview} mode="inner">
      <article className="ts-inner ts-inner--empty">
        <div className="ts-inner__emptyicon" aria-hidden="true">
          <Icon name="bookmark" size={28} />
        </div>
        <h1 className="ts-inner__title">העמוד הזה לא זמין כרגע</h1>
        <p className="ts-inner__lede">
          ייתכן שהפריט הוסר, הוסתר או עדיין לא פורסם. אפשר לחזור לדף הבית ולבחור תוכן זמין אחר.
        </p>
        <PublicLink href={getMainPublicSiteHref(preview)} className="ts-btn ts-btn--primary">
          חזרה לדף הבית
        </PublicLink>
      </article>
    </PublicSiteLayout>
  );
}

export function PublicSiteHubPage() {
  const location = useLocation();
  const preview = getPreviewMode(location.search);
  const state = publicSiteService.getState();
  const remainder = getPathRemainder(location.pathname);
  const keywords = "טיפול רגשי לילדים, טיפול באמנות, דימונה, אונליין, מטפלת באמנות";
  const landingItem = state.items.find((entry) => entry.id === "site-landing");
  const form = remainder.startsWith("/forms/") ? findPublicForm(state, remainder, preview) : null;
  const item = remainder !== "/" && !remainder.startsWith("/forms/") ? findPublicPage(state, remainder, preview) : null;
  const siteOrigin = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "") || window.location.origin;
  const canonicalUrl = `${siteOrigin}${location.pathname}`;
  const seoTitle =
    remainder === "/"
      ? landingItem?.seoTitle || state.mainWebsite.heroTitle
      : form
        ? `${form.title} | בת-אל פרץ`
        : item?.seoTitle || state.mainWebsite.siteTitle;
  const seoDescription =
    remainder === "/"
      ? landingItem?.seoDescription || state.mainWebsite.tagline
      : form
        ? form.summary || "טופס יצירת קשר ותיאום שיחת היכרות עם בת-אל פרץ, מטפלת באמנות בדימונה וגם אונליין."
        : item?.seoDescription || state.mainWebsite.tagline;

  usePublicSeo(seoTitle, seoDescription, keywords, canonicalUrl);

  if (remainder === "/") {
    return <PublicSiteHub state={state} preview={preview} />;
  }

  if (remainder.startsWith("/forms/")) {
    if (!form) {
      return <PublicNotAvailable state={state} preview={preview} />;
    }
    return <PublicFormPage state={state} preview={preview} form={form} />;
  }

  if (!item) {
    return <PublicNotAvailable state={state} preview={preview} />;
  }

  return <PublicContentPage state={state} preview={preview} item={item} />;
}
