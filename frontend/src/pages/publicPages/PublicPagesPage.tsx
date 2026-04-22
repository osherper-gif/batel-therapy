import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Tabs } from "../../design-system/Tabs";
import { Badge } from "../../design-system/Badge";
import { Icon } from "../../design-system/Icon";
import type { IconName } from "../../design-system/Icon";
import { Field, SelectInput, TextArea, TextInput } from "../../design-system/Field";
import { Callout } from "../../design-system/Callout";
import { publicSiteService } from "../../services/publicSiteService";
import { getMainPublicSiteHref, getPublicFormHref, getPublicSiteItemHref } from "../../services/publicSiteLinks";
import { showPlaceholderMessage } from "../../lib/uiActions";
import type {
  PublicFormDefinition,
  PublicSiteItem,
  PublicSiteItemStatus,
  PublicSiteManagerState
} from "../../types";

type WorkspaceSection = "website" | "pages" | "external" | "forms" | "publishing";

const statusToneMap: Record<PublicSiteItemStatus, "success" | "info" | "muted"> = {
  published: "success",
  draft: "info",
  archived: "muted"
};

const statusDotColor: Record<PublicSiteItemStatus, string> = {
  published: "var(--sage-500, #6f9170)",
  draft: "var(--clay-400, #c9a07a)",
  archived: "var(--text-muted, #8a8a8a)"
};

const pageTypeLabels: Record<PublicSiteItem["pageType"], string> = {
  landing: "דף נחיתה",
  content_page: "מאמר / מידע",
  contact_page: "יצירת קשר",
  form_page: "עמוד טופס",
  external_html: "אתר HTML חיצוני",
  resource_page: "מדריך / משאב"
};

const pageTypeIcon: Record<PublicSiteItem["pageType"], IconName> = {
  landing: "home",
  content_page: "fileText",
  contact_page: "mail",
  form_page: "clipboard",
  external_html: "globe",
  resource_page: "bookmark"
};

const pageTypeAccent: Record<PublicSiteItem["pageType"], "sage" | "clay" | "lavender" | "info"> = {
  landing: "sage",
  content_page: "lavender",
  contact_page: "info",
  form_page: "info",
  external_html: "clay",
  resource_page: "lavender"
};

const formTypeLabels: Record<PublicFormDefinition["formType"], string> = {
  contact: "טופס יצירת קשר",
  consultation: "בקשת שיחת היכרות",
  parent_inquiry: "פניית הורה",
  school_inquiry: "פניית בית ספר"
};

const formTypeIcon: Record<PublicFormDefinition["formType"], IconName> = {
  contact: "mail",
  consultation: "messageCircle",
  parent_inquiry: "heart",
  school_inquiry: "users"
};

function formatStatus(status: PublicSiteItemStatus) {
  if (status === "published") return "חי באתר";
  if (status === "archived") return "מוסתר";
  return "טיוטה";
}

function formatDate(value: string | null) {
  if (!value) return "טרם פורסם";
  return new Date(value).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function relativeUpdated(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "עודכן היום";
  if (days === 1) return "עודכן אתמול";
  if (days < 30) return `עודכן לפני ${days} ימים`;
  const months = Math.floor(days / 30);
  return months === 1 ? "עודכן לפני חודש" : `עודכן לפני ${months} חודשים`;
}



function getTargetLabel(state: PublicSiteManagerState, targetId: string | null) {
  if (!targetId) return "ללא יעד";
  const page = state.items.find((item) => item.id === targetId);
  if (page) return page.title;
  const form = state.forms.find((item) => item.id === targetId);
  if (form) return form.title;
  return targetId;
}

export function PublicPagesPage() {
  const [section, setSection] = useState<WorkspaceSection>("website");
  const [managerState, setManagerState] = useState<PublicSiteManagerState>(() => publicSiteService.getState());
  const [selectedPageId, setSelectedPageId] = useState<string>("site-landing");
  const [selectedExternalId, setSelectedExternalId] = useState<string>("external-art-therapy-site");
  const [selectedFormId, setSelectedFormId] = useState<string>("form-contact");

  useEffect(() => {
    setManagerState(publicSiteService.getState());
  }, []);

  const publicPages = useMemo(
    () => managerState.items.filter((item) => item.pageType !== "external_html"),
    [managerState.items]
  );
  const externalPages = useMemo(
    () => managerState.items.filter((item) => item.pageType === "external_html"),
    [managerState.items]
  );

  const selectedPage = publicPages.find((item) => item.id === selectedPageId) ?? publicPages[0] ?? null;
  const selectedExternal = externalPages.find((item) => item.id === selectedExternalId) ?? externalPages[0] ?? null;
  const selectedForm = managerState.forms.find((item) => item.id === selectedFormId) ?? managerState.forms[0] ?? null;

  function sync(nextState: PublicSiteManagerState) {
    setManagerState(nextState);
  }

  function focusLinkedTarget(targetId: string | null | undefined) {
    if (!targetId) {
      showPlaceholderMessage("לכפתור הזה עדיין לא הוגדר יעד. אפשר לבחור יעד מתוך עורך האתר הראשי.");
      return;
    }

    const item = managerState.items.find((entry) => entry.id === targetId);
    if (item) {
      if (item.pageType === "external_html") {
        setSelectedExternalId(item.id);
        setSection("external");
        return;
      }

      setSelectedPageId(item.id);
      setSection("pages");
      return;
    }

    const form = managerState.forms.find((entry) => entry.id === targetId);
    if (form) {
      setSelectedFormId(form.id);
      setSection("forms");
      return;
    }

    showPlaceholderMessage(`לא נמצא יעד ציבורי עבור ${targetId}.`);
  }

  function openExternalItem(item: PublicSiteItem) {
    const href = getPublicSiteItemHref(item, true);

    if (!href) {
      showPlaceholderMessage(`למשאב "${item.title}" עדיין לא הוגדרה כתובת מוגשת או קישור פתיחה.`);
      return;
    }

    window.location.assign(href);
  }

  function openMainPublicSite(preview = true) {
    window.location.assign(getMainPublicSiteHref(preview));
  }

  function handlePreview(entity: PublicSiteItem | PublicFormDefinition) {
    if ("pageType" in entity) {
      const href = getPublicSiteItemHref(entity, true);
      if (!href) {
        showPlaceholderMessage(`אי אפשר לפתוח כרגע את "${entity.title}". בדקי שהפריט קיבל כתובת ויעד תקינים.`);
        return;
      }
      window.location.assign(href);
      return;
    }

    const href = getPublicFormHref(entity, true);
    if (!href) {
      showPlaceholderMessage(`אי אפשר לפתוח כרגע את הטופס "${entity.title}".`);
      return;
    }
    window.location.assign(href);
  }

  function handlePreviewSite() {
    openMainPublicSite(true);
  }

  function handlePublish(itemId: string) {
    sync(publicSiteService.publishItem(itemId));
  }

  function handleUnpublish(itemId: string) {
    sync(publicSiteService.unpublishItem(itemId));
  }

  function handleArchive(itemId: string) {
    sync(publicSiteService.archiveItem(itemId));
  }

  function handleRestore(itemId: string) {
    sync(publicSiteService.unpublishItem(itemId));
  }

  const publishedCount = managerState.items.filter((item) => item.status === "published").length;
  const draftCount = managerState.items.filter((item) => item.status === "draft").length;
  const archivedCount = managerState.items.filter((item) => item.status === "archived").length;

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="האתר הציבורי שלך"
        title="ניהול האתר"
        subtitle="כאן את מנהלת את האתר, הדפים והפניות שמופיעים לכל מי שמחפש אותך באינטרנט."
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="eye" size={16} />}
              onClick={handlePreviewSite}
            >
              תצוגת האתר
            </Button>
            <Button
              iconStart={<Icon name="globe" size={16} />}
              onClick={() => setSection("publishing")}
            >
              מה מתפרסם
            </Button>
          </>
        }
      />

      <SiteHero
        state={managerState}
        publishedCount={publishedCount}
        draftCount={draftCount}
        archivedCount={archivedCount}
        onEdit={() => setSection("website")}
        onPreview={handlePreviewSite}
        onOpenLiveSite={() => openMainPublicSite(false)}
        onPrimaryCta={() => focusLinkedTarget(managerState.mainWebsite.primaryCtaTargetId)}
        onSecondaryCta={() => focusLinkedTarget(managerState.mainWebsite.secondaryCtaTargetId)}
      />

      <Card>
        <CardBody compact>
          <Tabs<WorkspaceSection>
            value={section}
            onChange={setSection}
            items={[
          { value: "website", label: "האתר שלך", icon: <Icon name="home" size={14} /> },
          { value: "pages", label: "הדפים שלך", icon: <Icon name="fileText" size={14} />, count: publicPages.length },
          { value: "external", label: "עמודים מיוחדים", icon: <Icon name="bookmark" size={14} />, count: externalPages.length },
          { value: "forms", label: "איך פונים אליך", icon: <Icon name="messageCircle" size={14} />, count: managerState.forms.length },
          { value: "publishing", label: "מה מתפרסם", icon: <Icon name="eye" size={14} /> }
            ]}
          />
        </CardBody>
      </Card>

      {section === "website" ? (
        <MainWebsiteSection state={managerState} onChange={(patch) => sync(publicSiteService.updateMainWebsite(patch))} />
      ) : null}

      {section === "pages" && selectedPage ? (
        <ManagedPagesSection
          pages={publicPages}
          selectedPage={selectedPage}
          selectedPageId={selectedPageId}
          onSelect={setSelectedPageId}
          onUpdate={(itemId, patch) => sync(publicSiteService.updateItem(itemId, patch))}
          onPreview={handlePreview}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onArchive={handleArchive}
        />
      ) : null}

      {section === "external" ? (
        <ExternalHtmlSection
          items={externalPages}
          selectedItem={selectedExternal}
          selectedItemId={selectedExternalId}
          onSelect={setSelectedExternalId}
          onUpdate={(itemId, patch) => sync(publicSiteService.updateItem(itemId, patch))}
          onPreview={handlePreview}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onArchive={handleArchive}
        />
      ) : null}

      {section === "forms" && selectedForm ? (
        <PublicFormsSection
          forms={managerState.forms}
          pages={managerState.items}
          selectedForm={selectedForm}
          selectedFormId={selectedFormId}
          onSelect={setSelectedFormId}
          onUpdate={(formId, patch) => sync(publicSiteService.updateForm(formId, patch))}
          onPreview={handlePreview}
        />
      ) : null}

      {section === "publishing" ? (
        <PublishingBoard
          state={managerState}
          onPreview={handlePreview}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onArchive={handleArchive}
          onRestore={handleRestore}
        />
      ) : null}
    </div>
  );
}

/* ---------- Hero "Your Website" preview ---------- */

function SiteHero({
  state,
  publishedCount,
  draftCount,
  archivedCount,
  onEdit,
  onPreview,
  onOpenLiveSite,
  onPrimaryCta,
  onSecondaryCta
}: {
  state: PublicSiteManagerState;
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
  onEdit: () => void;
  onPreview: () => void;
  onOpenLiveSite: () => void;
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}) {
  const site = state.mainWebsite;

  return (
    <Card>
      <CardBody>
        <div className="qc-hero">
          <div className="qc-hero__meta">
            <div className="ds-row" style={{ gap: 8, alignItems: "center" }}>
              <Badge tone="sage" dot>
                האתר חי
              </Badge>
              <span className="ds-t-xs ds-t-muted">{site.siteUrl}</span>
            </div>
            <h2 className="qc-hero__title">{site.siteTitle}</h2>
            <p className="qc-hero__tagline">{site.tagline}</p>

            <div className="qc-hero__chips">
              <HeroChip icon="checkCircle" tone="sage" label="חי באתר" value={publishedCount} />
              <HeroChip icon="edit" tone="clay" label="טיוטות" value={draftCount} />
              <HeroChip icon="folder" tone="muted" label="מוסתר" value={archivedCount} />
              <HeroChip icon="clipboard" tone="lavender" label="טפסים" value={state.forms.length} />
            </div>

            <div className="ds-row" style={{ gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Button iconStart={<Icon name="edit" size={16} />} onClick={onEdit}>
                ערכי את האתר
              </Button>
              <Button variant="secondary" iconStart={<Icon name="eye" size={16} />} onClick={onPreview}>
                ראי תצוגה
              </Button>
              <Button variant="ghost" iconStart={<Icon name="globe" size={16} />} onClick={onOpenLiveSite}>
                פתחי באתר חי
              </Button>
            </div>
          </div>

          <div className="qc-hero__preview" aria-hidden>
            <div className="qc-browser">
              <div className="qc-browser__bar">
                <span className="qc-browser__dot" data-color="red" />
                <span className="qc-browser__dot" data-color="amber" />
                <span className="qc-browser__dot" data-color="green" />
                <div className="qc-browser__url">{site.siteUrl}</div>
              </div>
              <div className="qc-browser__viewport">
                <div className="qc-browser__nav">
                  <strong>{site.siteTitle}</strong>
                  <div className="qc-browser__navlinks">
                    {site.navigation.slice(0, 4).map((entry) => (
                      <span key={entry.id}>{entry.label}</span>
                    ))}
                  </div>
                </div>
                <div className="qc-browser__hero">
                  <div className="qc-browser__heroTitle">{site.heroTitle}</div>
                  <div className="qc-browser__heroSub">{site.heroSubtitle}</div>
                  <div className="qc-browser__heroCtas">
                    <button
                      type="button"
                      className="qc-browser__cta qc-browser__cta--primary"
                      onClick={onPrimaryCta}
                      data-testid="public-hero-primary-cta"
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      {site.primaryCtaLabel}
                    </button>
                    <button
                      type="button"
                      className="qc-browser__cta qc-browser__cta--secondary"
                      onClick={onSecondaryCta}
                      data-testid="public-hero-secondary-cta"
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      {site.secondaryCtaLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function HeroChip({
  icon,
  label,
  value,
  tone
}: {
  icon: IconName;
  label: string;
  value: number;
  tone: "sage" | "clay" | "muted" | "lavender";
}) {
  return (
    <div className={`qc-hero-chip qc-hero-chip--${tone}`}>
      <Icon name={icon} size={16} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ActionLinkButton({
  href,
  label,
  icon,
  variant = "primary",
  size = "sm",
  dataTestId,
  openInNewTab = false
}: {
  href: string;
  label: string;
  icon: IconName;
  variant?: "primary" | "secondary" | "ghost" | "subtle";
  size?: "sm" | "md";
  dataTestId?: string;
  openInNewTab?: boolean;
}) {
  return (
    <a
      href={href}
      className={["ds-btn", `ds-btn--${variant}`, size === "sm" ? "ds-btn--sm" : ""].filter(Boolean).join(" ")}
      data-testid={dataTestId}
      onClick={(event) => event.stopPropagation()}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noreferrer noopener" : undefined}
    >
      <Icon name={icon} size={size === "sm" ? 14 : 16} />
      {label}
    </a>
  );
}

/* ---------- Section: Main Website (friendly editor) ---------- */

function MainWebsiteSection({
  state,
  onChange
}: {
  state: PublicSiteManagerState;
  onChange: (patch: Partial<PublicSiteManagerState["mainWebsite"]>) => void;
}) {
  const websitePages = state.items.filter((item) => item.pageType !== "external_html");
  const formTargets = state.forms;

  return (
    <div className="ds-grid ds-grid--2-1">
      <Card>
        <CardHeader
          title="זהות של האתר"
          subtitle="הטקסט והכפתורים שכל מי שנכנס לאתר רואה בעמוד הבית."
          eyebrow={<Icon name="sparkles" size={14} />}
        />
        <CardBody>
          <div className="ds-col ds-col--md">
            <div className="ds-form-grid ds-form-grid--2">
              <Field label="שם האתר">
                <TextInput
                  value={state.mainWebsite.siteTitle}
                  onChange={(event) => onChange({ siteTitle: event.target.value })}
                />
              </Field>
              <Field label="משפט פתיחה" hint="טקסט קצר שמופיע מתחת לשם האתר.">
                <TextInput
                  value={state.mainWebsite.tagline}
                  onChange={(event) => onChange({ tagline: event.target.value })}
                />
              </Field>
            </div>

            <div className="qc-section-label">מה רואים ברגע שנכנסים לאתר</div>
            <Field label="כותרת ראשית">
              <TextInput
                value={state.mainWebsite.heroTitle}
                onChange={(event) => onChange({ heroTitle: event.target.value })}
              />
            </Field>
            <Field label="טקסט תיאור" hint="2–3 שורות שמסבירות במה את עוסקת ולמי האתר מיועד.">
              <TextArea
                rows={3}
                value={state.mainWebsite.heroSubtitle}
                onChange={(event) => onChange({ heroSubtitle: event.target.value })}
              />
            </Field>

            <div className="qc-section-label">כפתורים שמובילים לפעולה</div>
            <div className="ds-form-grid ds-form-grid--2">
              <Field label="כפתור ראשי">
                <TextInput
                  value={state.mainWebsite.primaryCtaLabel}
                  onChange={(event) => onChange({ primaryCtaLabel: event.target.value })}
                />
              </Field>
              <Field label="לאן הוא מוביל">
                <SelectInput
                  value={state.mainWebsite.primaryCtaTargetId ?? ""}
                  onChange={(event) => onChange({ primaryCtaTargetId: event.target.value || null })}
                >
                  <option value="">בחרי יעד…</option>
                  {formTargets.map((form) => (
                    <option key={form.id} value={form.id}>
                      טופס · {form.title}
                    </option>
                  ))}
                  {websitePages.map((item) => (
                    <option key={item.id} value={item.id}>
                      עמוד · {item.title}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="כפתור משני">
                <TextInput
                  value={state.mainWebsite.secondaryCtaLabel}
                  onChange={(event) => onChange({ secondaryCtaLabel: event.target.value })}
                />
              </Field>
              <Field label="לאן הוא מוביל">
                <SelectInput
                  value={state.mainWebsite.secondaryCtaTargetId ?? ""}
                  onChange={(event) => onChange({ secondaryCtaTargetId: event.target.value || null })}
                >
                  <option value="">בחרי יעד…</option>
                  {websitePages.map((item) => (
                    <option key={item.id} value={item.id}>
                      עמוד · {item.title}
                    </option>
                  ))}
                  {formTargets.map((form) => (
                    <option key={form.id} value={form.id}>
                      טופס · {form.title}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>

            <details className="qc-advanced">
              <summary>אפשרויות מתקדמות</summary>
              <div className="ds-form-grid ds-form-grid--2" style={{ marginTop: 12 }}>
                <Field label="כתובת האתר (Domain)">
                  <TextInput
                    value={state.mainWebsite.siteUrl}
                    onChange={(event) => onChange({ siteUrl: event.target.value })}
                  />
                </Field>
                <Field label="עמוד יצירת קשר ברירת מחדל">
                  <SelectInput
                    value={state.mainWebsite.contactPageId ?? ""}
                    onChange={(event) => onChange({ contactPageId: event.target.value || null })}
                  >
                    <option value="">ללא</option>
                    {websitePages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
            </details>
          </div>
        </CardBody>
      </Card>

      <Card variant="muted">
        <CardHeader
          title="הקישורים בתפריט שלך"
          subtitle="הניווט שמופיע בראש כל עמוד באתר."
          eyebrow={<Icon name="menu" size={14} />}
        />
        <CardBody compact>
          <div className="ds-col ds-col--sm">
            {state.mainWebsite.navigation.map((entry) => (
              <div key={entry.id} className="qc-nav-row">
                <Icon
                  name={entry.targetType === "external" ? "globe" : entry.targetType === "form" ? "clipboard" : "fileText"}
                  size={18}
                />
                <div className="qc-nav-row__text">
                  <strong>{entry.label}</strong>
                  <span className="ds-t-xs ds-t-muted">{getTargetLabel(state, entry.targetId)}</span>
                </div>
                <Badge tone={entry.isPrimary ? "sage" : "muted"}>
                  {entry.isPrimary ? "ראשי" : "משני"}
                </Badge>
              </div>
            ))}

            <div className="qc-section-label" style={{ marginTop: 8 }}>
              עמודים מודגשים בעמוד הבית
            </div>
            <div className="qc-feature-chips">
              {state.mainWebsite.featuredPageIds.map((pageId) => (
                <Badge key={pageId} tone="lavender" icon={<Icon name="bookmark" size={12} />}>
                  {getTargetLabel(state, pageId)}
                </Badge>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ---------- Section: Public Pages (card grid) ---------- */

function ManagedPagesSection({
  pages,
  selectedPage,
  selectedPageId,
  onSelect,
  onUpdate,
  onPreview,
  onPublish,
  onUnpublish,
  onArchive
}: {
  pages: PublicSiteItem[];
  selectedPage: PublicSiteItem;
  selectedPageId: string;
  onSelect: (value: string) => void;
  onUpdate: (itemId: string, patch: Partial<PublicSiteItem>) => void;
  onPreview: (entity: PublicSiteItem) => void;
  onPublish: (itemId: string) => void;
  onUnpublish: (itemId: string) => void;
  onArchive: (itemId: string) => void;
}) {
  return (
    <div className="ds-col ds-col--lg">
      <div className="qc-section-head">
        <div>
          <h3 className="qc-section-head__title">הדפים שלך</h3>
          <p className="qc-section-head__subtitle">
            כל עמוד שאת מנהלת באתר. לחיצה על כרטיס פותחת את העריכה הידידותית.
          </p>
        </div>
        <Button
          iconStart={<Icon name="plus" size={16} />}
          onClick={() =>
            showPlaceholderMessage("יצירת דף חדש תתחבר לאשף הוספת דפים בשלב הבא.")
          }
        >
          דף חדש
        </Button>
      </div>

      <div className="qc-page-grid">
        {pages.map((page) => (
          <PageTile
            key={page.id}
            page={page}
            selected={page.id === selectedPageId}
            onSelect={() => onSelect(page.id)}
            onPreview={() => onPreview(page)}
            onPublishToggle={() =>
              page.status === "published" ? onUnpublish(page.id) : onPublish(page.id)
            }
          />
        ))}
      </div>

      <PageEditorPanel
        page={selectedPage}
        onUpdate={(patch) => onUpdate(selectedPage.id, patch)}
        onPreview={() => onPreview(selectedPage)}
        onPublish={() => onPublish(selectedPage.id)}
        onUnpublish={() => onUnpublish(selectedPage.id)}
        onArchive={() => onArchive(selectedPage.id)}
      />
    </div>
  );
}

function PageTile({
  page,
  selected,
  onSelect,
  onPreview,
  onPublishToggle
}: {
  page: PublicSiteItem;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onPublishToggle: () => void;
}) {
  const accent = pageTypeAccent[page.pageType];
  return (
    <article
      className={`qc-page-card${selected ? " qc-page-card--active" : ""}`}
      data-accent={accent}
      data-public-page-id={page.id}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSelect();
      }}
    >
      <div className="qc-page-card__topline">
        <div className={`qc-page-card__icon qc-page-card__icon--${accent}`}>
          <Icon name={pageTypeIcon[page.pageType]} size={18} />
        </div>
        <Badge tone={statusToneMap[page.status]} dot>
          {formatStatus(page.status)}
        </Badge>
      </div>

      <div className="qc-page-card__type">{pageTypeLabels[page.pageType]}</div>
      <h4 className="qc-page-card__title">{page.title}</h4>
      <p className="qc-page-card__summary">{page.summary || "ללא תיאור — מומלץ להוסיף משפט קצר שמסביר במה העמוד עוסק."}</p>

      <div className="qc-page-card__meta">
        <span>
          <Icon name="clock" size={12} />
          {relativeUpdated(page.updatedAt)}
        </span>
        {page.featured ? (
          <span className="qc-page-card__pin">
            <Icon name="bookmark" size={12} />
            מודגש
          </span>
        ) : null}
      </div>

      <div className="qc-page-card__actions" onClick={(event) => event.stopPropagation()}>
        <Button size="sm" variant="ghost" iconStart={<Icon name="edit" size={14} />} onClick={onSelect}>
          ערוך
        </Button>
        <Button size="sm" variant="ghost" iconStart={<Icon name="eye" size={14} />} onClick={onPreview}>
          תצוגה
        </Button>
        <Button
          size="sm"
          variant={page.status === "published" ? "subtle" : "primary"}
          iconStart={<Icon name={page.status === "published" ? "clock" : "globe"} size={14} />}
          onClick={onPublishToggle}
        >
          {page.status === "published" ? "הסתר" : "פרסמי"}
        </Button>
      </div>
    </article>
  );
}

function PageEditorPanel({
  page,
  onUpdate,
  onPreview,
  onPublish,
  onUnpublish,
  onArchive
}: {
  page: PublicSiteItem;
  onUpdate: (patch: Partial<PublicSiteItem>) => void;
  onPreview: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onArchive: () => void;
}) {
  return (
    <Card>
      <CardHeader
        eyebrow={<Icon name="edit" size={14} />}
        title={<span>עריכת: <strong>{page.title}</strong></span>}
        subtitle="שני שדות בלבד נדרשים — שאר ההגדרות הטכניות מתחת ל'אפשרויות מתקדמות'."
        actions={
          <>
            <Button variant="secondary" size="sm" iconStart={<Icon name="eye" size={14} />} onClick={onPreview}>
              תצוגה
            </Button>
            {page.status !== "published" ? (
              <Button size="sm" iconStart={<Icon name="globe" size={14} />} onClick={onPublish} data-testid="public-page-status-toggle">
                פרסמי
              </Button>
            ) : (
              <Button size="sm" variant="subtle" iconStart={<Icon name="clock" size={14} />} onClick={onUnpublish} data-testid="public-page-status-toggle">
                הסתירי
              </Button>
            )}
          </>
        }
      />
      <CardBody>
        <div className="ds-col ds-col--md">
          <Field label="שם הדף" id="public-page-title">
            <TextInput id="public-page-title" data-testid="public-page-title" value={page.title} onChange={(event) => onUpdate({ title: event.target.value })} />
          </Field>
          <Field label="מה כתוב בדף הזה" hint="2–3 שורות שמסבירות מה הקורא יקבל מהדף.">
            <TextArea
              rows={3}
              value={page.summary}
              onChange={(event) => onUpdate({ summary: event.target.value })}
            />
          </Field>

          <div className="qc-toggle-row">
            <div>
              <strong>הציגי בעמוד הבית</strong>
              <p className="ds-t-xs ds-t-muted" style={{ margin: 0 }}>
                כרטיס של הדף יופיע במקטע "מומלץ" באתר הראשי.
              </p>
            </div>
            <Button
              size="sm"
              variant={page.featured ? "primary" : "ghost"}
              iconStart={<Icon name={page.featured ? "checkCircle" : "bookmark"} size={14} />}
              onClick={() => onUpdate({ featured: !page.featured })}
            >
              {page.featured ? "מודגש" : "הוסיפי הדגשה"}
            </Button>
          </div>

          <div className="qc-meta-row">
            <Badge tone={statusToneMap[page.status]} dot>
              {formatStatus(page.status)}
            </Badge>
            <Badge tone="muted">
              <Icon name="clock" size={12} /> {formatDate(page.updatedAt)}
            </Badge>
            <Badge tone="lavender">{pageTypeLabels[page.pageType]}</Badge>
          </div>

          <details className="qc-advanced">
            <summary>אפשרויות מתקדמות (כתובת, SEO, סוג עמוד)</summary>
            <div className="ds-form-grid ds-form-grid--2" style={{ marginTop: 12 }}>
              <Field label="כתובת באתר (Slug)">
                <TextInput value={page.slug} onChange={(event) => onUpdate({ slug: event.target.value })} />
              </Field>
              <Field label="סוג עמוד">
                <SelectInput
                  value={page.pageType}
                  onChange={(event) => onUpdate({ pageType: event.target.value as PublicSiteItem["pageType"] })}
                >
                  {Object.entries(pageTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="כותרת ל-Google" hint="עד 60 תווים — מופיע בלשונית ובחיפוש.">
                <TextInput
                  value={page.seoTitle ?? ""}
                  onChange={(event) => onUpdate({ seoTitle: event.target.value })}
                />
              </Field>
              <Field label="תיאור ל-Google" hint="עד 160 תווים.">
                <TextArea
                  rows={2}
                  value={page.seoDescription ?? ""}
                  onChange={(event) => onUpdate({ seoDescription: event.target.value })}
                />
              </Field>
            </div>
            <Button
              variant="ghost"
              iconStart={<Icon name="folder" size={14} />}
              onClick={onArchive}
              style={{ marginTop: 12 }}
            >
              העבירי לארכיון
            </Button>
          </details>
        </div>
      </CardBody>
    </Card>
  );
}

/* ---------- Section: External / Special Resources ---------- */

function ExternalHtmlSection({
  items,
  selectedItem,
  selectedItemId,
  onSelect,
  onUpdate,
  onPreview,
  onPublish,
  onUnpublish,
  onArchive
}: {
  items: PublicSiteItem[];
  selectedItem: PublicSiteItem | null;
  selectedItemId: string;
  onSelect: (value: string) => void;
  onUpdate: (itemId: string, patch: Partial<PublicSiteItem>) => void;
  onPreview: (entity: PublicSiteItem) => void;
  onPublish: (itemId: string) => void;
  onUnpublish: (itemId: string) => void;
  onArchive: (itemId: string) => void;
}) {
  return (
    <div className="ds-col ds-col--lg">
      <Callout tone="lavender" title="מה זה 'עמודים מיוחדים'?" icon="bookmark">
        עמודים שכבר קיימים כקובץ HTML עצמאי — למשל המדריך למצבי חירום או דף סדנה. הם מופיעים באתר כמשאבים ומתעדכנים מכאן.
      </Callout>

      <div className="qc-resource-grid">
        {items.map((item) => (
          <ResourceTile
            key={item.id}
            item={item}
            selected={item.id === selectedItemId}
            onSelect={() => onSelect(item.id)}
            onPreview={() => onPreview(item)}
            onPublishToggle={() =>
              item.status === "published" ? onUnpublish(item.id) : onPublish(item.id)
            }
          />
        ))}
      </div>

      {selectedItem ? (
        <Card>
          <CardHeader
            eyebrow={<Icon name="globe" size={14} />}
            title={<span>עריכת משאב: <strong>{selectedItem.title}</strong></span>}
            subtitle="הכותרת והתיאור מופיעים לקהל. הקובץ עצמו מנוהל בהגדרות מתקדמות."
            actions={
              <>
                {getPublicSiteItemHref(selectedItem, true) ? (
                  <ActionLinkButton
                    href={getPublicSiteItemHref(selectedItem, true)}
                    label="פתחי משאב"
                    icon="eye"
                    variant="secondary"
                    size="sm"
                    dataTestId="external-resource-open"
                    openInNewTab
                  />
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    iconStart={<Icon name="eye" size={14} />}
                    onClick={() => onPreview(selectedItem)}
                    data-testid="external-resource-open"
                  >
                    פתחי משאב
                  </Button>
                )}
                {selectedItem.status !== "published" ? (
                  <Button size="sm" iconStart={<Icon name="globe" size={14} />} onClick={() => onPublish(selectedItem.id)}>
                    הפכי לזמין
                  </Button>
                ) : (
                  <Button size="sm" variant="subtle" iconStart={<Icon name="clock" size={14} />} onClick={() => onUnpublish(selectedItem.id)}>
                    הסתירי
                  </Button>
                )}
              </>
            }
          />
          <CardBody>
            <div className="ds-col ds-col--md">
              <Field label="שם המשאב">
                <TextInput
                  value={selectedItem.title}
                  onChange={(event) => onUpdate(selectedItem.id, { title: event.target.value })}
                />
              </Field>
              <Field label="מה הקורא ימצא כאן" hint="תיאור קצר וברור — זה מה שמופיע מתחת לשם המשאב.">
                <TextArea
                  rows={3}
                  value={selectedItem.summary}
                  onChange={(event) => onUpdate(selectedItem.id, { summary: event.target.value })}
                />
              </Field>

              <div className="qc-meta-row">
                <Badge tone={statusToneMap[selectedItem.status]} dot>
                  {formatStatus(selectedItem.status)}
                </Badge>
                <Badge tone="muted"><Icon name="clock" size={12} /> {formatDate(selectedItem.updatedAt)}</Badge>
                <Badge tone="clay">{pageTypeLabels[selectedItem.pageType]}</Badge>
              </div>

              <details className="qc-advanced">
                <summary>אפשרויות מתקדמות (קובץ מקור, קישור)</summary>
                <div className="ds-col ds-col--sm" style={{ marginTop: 12 }}>
                  <Field label="קובץ HTML מקור" hint="הקובץ במערכת הקבצים של BATEL.">
                    <TextInput
                      value={selectedItem.externalPath ?? ""}
                      onChange={(event) => onUpdate(selectedItem.id, { externalPath: event.target.value })}
                    />
                  </Field>
                  <Field label="קישור ציבורי (אם יש)">
                    <TextInput
                      value={selectedItem.externalUrl ?? ""}
                      onChange={(event) => onUpdate(selectedItem.id, { externalUrl: event.target.value })}
                    />
                  </Field>
                  <Button
                    variant="ghost"
                    iconStart={<Icon name="folder" size={14} />}
                    onClick={() => onArchive(selectedItem.id)}
                  >
                    העבירי לארכיון
                  </Button>
                </div>
              </details>
            </div>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}

function ResourceTile({
  item,
  selected,
  onSelect,
  onPreview,
  onPublishToggle
}: {
  item: PublicSiteItem;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onPublishToggle: () => void;
}) {
  return (
    <article
      className={`qc-resource-card${selected ? " qc-resource-card--active" : ""}`}
      data-external-item-id={item.id}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSelect();
      }}
    >
      <div className="qc-resource-card__icon">
        <Icon name="bookmark" size={22} />
      </div>
      <div className="qc-resource-card__body">
        <div className="ds-row" style={{ justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span className="ds-t-xs ds-t-muted">{pageTypeLabels[item.pageType]}</span>
          <Badge tone={statusToneMap[item.status]} dot>
            {formatStatus(item.status)}
          </Badge>
        </div>
        <h4 className="qc-resource-card__title">{item.title}</h4>
        <p className="qc-resource-card__summary">{item.summary}</p>
        <div className="qc-resource-card__actions" onClick={(event) => event.stopPropagation()}>
          {getPublicSiteItemHref(item, true) ? (
            <ActionLinkButton href={getPublicSiteItemHref(item, true)} label="פתחי משאב" icon="globe" openInNewTab />
          ) : (
            <Button size="sm" iconStart={<Icon name="globe" size={14} />} onClick={onPreview}>
              פתחי משאב
            </Button>
          )}
          <Button size="sm" variant="ghost" iconStart={<Icon name="edit" size={14} />} onClick={onSelect}>
            ערוך
          </Button>
          <Button
            size="sm"
            variant="ghost"
            iconStart={<Icon name={item.status === "published" ? "clock" : "checkCircle"} size={14} />}
            onClick={(event) => {
              event.stopPropagation();
              onPublishToggle();
            }}
          >
            {item.status === "published" ? "הסתירי" : "הפכי לזמין"}
          </Button>
        </div>
      </div>
    </article>
  );
}

/* ---------- Section: Forms / Ways People Contact You ---------- */

function PublicFormsSection({
  forms,
  pages,
  selectedForm,
  selectedFormId,
  onSelect,
  onUpdate,
  onPreview
}: {
  forms: PublicFormDefinition[];
  pages: PublicSiteItem[];
  selectedForm: PublicFormDefinition;
  selectedFormId: string;
  onSelect: (value: string) => void;
  onUpdate: (formId: string, patch: Partial<PublicFormDefinition>) => void;
  onPreview: (entity: PublicFormDefinition) => void;
}) {
  return (
    <div className="ds-col ds-col--lg">
      <Callout tone="info" title="הדרכים שבהן אנשים יכולים לפנות אליך" icon="messageCircle">
        כל טופס כאן הוא נקודת מגע — הורים, בתי ספר, או פניות כלליות. כשמישהו ממלא, התשובה מגיעה אלייך לתיבה שהגדרת.
      </Callout>

      <div className="qc-form-grid">
        {forms.map((form) => (
          <FormTile
            key={form.id}
            form={form}
            selected={form.id === selectedFormId}
            onSelect={() => onSelect(form.id)}
            onPreview={() => onPreview(form)}
            linkedPageTitle={pages.find((page) => page.id === form.linkedPageId)?.title ?? null}
          />
        ))}
      </div>

      <Card>
        <CardHeader
          eyebrow={<Icon name="clipboard" size={14} />}
          title={<span>עריכת טופס: <strong>{selectedForm.title}</strong></span>}
          subtitle="ידידותי תחילה — שדות תפעוליים מתחת ל'אפשרויות מתקדמות'."
          actions={
            <Button variant="secondary" size="sm" iconStart={<Icon name="eye" size={14} />} onClick={() => onPreview(selectedForm)}>
              איך הטופס נראה
            </Button>
          }
        />
        <CardBody>
          <div className="ds-col ds-col--md">
            <Field label="שם הטופס">
              <TextInput
                value={selectedForm.title}
                onChange={(event) => onUpdate(selectedForm.id, { title: event.target.value })}
              />
            </Field>
            <Field label="מה כתוב מעל הטופס" hint="טקסט קצר שמרגיע ומסביר למה כדאי למלא.">
              <TextArea
                rows={3}
                value={selectedForm.summary}
                onChange={(event) => onUpdate(selectedForm.id, { summary: event.target.value })}
              />
            </Field>

            <div className="ds-form-grid ds-form-grid--2">
              <Field label="התשובות נשלחות אל" id="public-form-destination-email">
                <TextInput
                  id="public-form-destination-email"
                  data-testid="public-form-destination-email"
                  value={selectedForm.destinationEmail}
                  onChange={(event) => onUpdate(selectedForm.id, { destinationEmail: event.target.value })}
                />
              </Field>
              <Field label="לאיזה עמוד מקושר">
                <SelectInput
                  value={selectedForm.linkedPageId ?? ""}
                  onChange={(event) => onUpdate(selectedForm.id, { linkedPageId: event.target.value || null })}
                >
                  <option value="">לא מקושר לעמוד</option>
                  {pages.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>

            <Field label="הודעת תודה אחרי שליחה" hint="הטקסט שמופיע למי שסיים למלא.">
              <TextArea
                rows={3}
                value={selectedForm.successMessage}
                onChange={(event) => onUpdate(selectedForm.id, { successMessage: event.target.value })}
              />
            </Field>

            <div className="qc-meta-row">
              <Badge tone={statusToneMap[selectedForm.status]} dot>
                {formatStatus(selectedForm.status)}
              </Badge>
              <Badge tone="muted">יעד: {selectedForm.destinationLabel}</Badge>
            </div>

            <details className="qc-advanced">
              <summary>אפשרויות מתקדמות (כתובת, סוג טופס)</summary>
              <div className="ds-form-grid ds-form-grid--2" style={{ marginTop: 12 }}>
                <Field label="כתובת באתר (Slug)">
                  <TextInput
                    value={selectedForm.slug}
                    onChange={(event) => onUpdate(selectedForm.id, { slug: event.target.value })}
                  />
                </Field>
                <Field label="סוג טופס">
                  <SelectInput
                    value={selectedForm.formType}
                    onChange={(event) =>
                      onUpdate(selectedForm.id, { formType: event.target.value as PublicFormDefinition["formType"] })
                    }
                  >
                    {Object.entries(formTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
            </details>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function FormTile({
  form,
  selected,
  onSelect,
  onPreview,
  linkedPageTitle
}: {
  form: PublicFormDefinition;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  linkedPageTitle: string | null;
}) {
  return (
    <article
      className={`qc-form-card${selected ? " qc-form-card--active" : ""}`}
      data-public-form-id={form.id}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSelect();
      }}
    >
      <div className="qc-form-card__icon">
        <Icon name={formTypeIcon[form.formType]} size={22} />
      </div>
      <div className="qc-form-card__body">
        <div className="ds-row" style={{ justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span className="ds-t-xs ds-t-muted">{formTypeLabels[form.formType]}</span>
          <Badge tone={statusToneMap[form.status]} dot>
            {formatStatus(form.status)}
          </Badge>
        </div>
        <h4 className="qc-form-card__title">{form.title}</h4>
        <p className="qc-form-card__summary">{form.summary}</p>

        <div className="qc-form-card__route">
          <span className="qc-route-line">
            <Icon name="mail" size={12} />
            התשובות נשלחות אל <strong>{form.destinationLabel}</strong>
          </span>
          <span className="qc-route-line">
            <Icon name="link" size={12} />
            {linkedPageTitle ? <>מקושר ל-<strong>{linkedPageTitle}</strong></> : "לא מקושר לעמוד"}
          </span>
        </div>

        <div className="qc-form-card__actions" onClick={(event) => event.stopPropagation()}>
          <Button size="sm" variant="ghost" iconStart={<Icon name="edit" size={14} />} onClick={onSelect}>
            ערוך
          </Button>
          <Button size="sm" variant="ghost" iconStart={<Icon name="eye" size={14} />} onClick={onPreview}>
            תצוגה
          </Button>
        </div>
      </div>
    </article>
  );
}

/* ---------- Section: Publishing Board (Live / Draft / Hidden) ---------- */

function PublishingBoard({
  state,
  onPreview,
  onPublish,
  onUnpublish,
  onArchive,
  onRestore
}: {
  state: PublicSiteManagerState;
  onPreview: (entity: PublicSiteItem | PublicFormDefinition) => void;
  onPublish: (itemId: string) => void;
  onUnpublish: (itemId: string) => void;
  onArchive: (itemId: string) => void;
  onRestore: (itemId: string) => void;
}) {
  const live = state.items.filter((item) => item.status === "published");
  const drafts = state.items.filter((item) => item.status === "draft");
  const hidden = state.items.filter((item) => item.status === "archived");

  return (
    <div className="ds-col ds-col--lg">
      <Callout tone="sage" title="מבט מהיר על מה שחי באתר" icon="eye">
        הלוח הזה מראה מה הקהל רואה כרגע, מה עוד בעבודה ומה הוסתר. אפשר להעביר פריט בין הסטטוסים בלחיצה אחת.
      </Callout>

      <div className="qc-pub-board">
        <PubColumn
          tone="success"
          icon="checkCircle"
          title="חי באתר"
          description="הקהל רואה את הפריטים האלה."
          items={live}
          status="published"
          onPreview={onPreview}
          onPrimary={(id) => onUnpublish(id)}
          primaryLabel="הסתירי"
          primaryIcon="clock"
          onSecondary={(id) => onArchive(id)}
          secondaryLabel="העבירי לארכיון"
        />
        <PubColumn
          tone="info"
          icon="edit"
          title="טיוטה"
          description="כמעט מוכן — חסרה רק לחיצה."
          items={drafts}
          status="draft"
          onPreview={onPreview}
          onPrimary={(id) => onPublish(id)}
          primaryLabel="פרסמי"
          primaryIcon="globe"
          onSecondary={(id) => onArchive(id)}
          secondaryLabel="הסתירי"
        />
        <PubColumn
          tone="muted"
          icon="folder"
          title="מוסתר / ארכיון"
          description="לא מופיע באתר. נשמר למקרה שתחזרי אליו."
          items={hidden}
          status="archived"
          onPreview={onPreview}
          onPrimary={(id) => onRestore(id)}
          primaryLabel="החזירי לטיוטה"
          primaryIcon="refresh"
          onSecondary={(id) => onPublish(id)}
          secondaryLabel="פרסמי ישירות"
        />
      </div>

      <Card variant="muted">
        <CardHeader
          eyebrow={<Icon name="link" size={14} />}
          title="מה מקושר לאתר הראשי"
          subtitle="הכפתורים והתפריט הראשי באתר מובילים כרגע לאלה."
        />
        <CardBody compact>
          <div className="ds-col ds-col--sm">
            <div className="qc-link-row">
              <Badge tone="sage">CTA ראשי</Badge>
              <strong>{state.mainWebsite.primaryCtaLabel}</strong>
              <Icon name="arrowLeft" size={14} />
              <span>{getTargetLabel(state, state.mainWebsite.primaryCtaTargetId)}</span>
            </div>
            <div className="qc-link-row">
              <Badge tone="lavender">CTA משני</Badge>
              <strong>{state.mainWebsite.secondaryCtaLabel}</strong>
              <Icon name="arrowLeft" size={14} />
              <span>{getTargetLabel(state, state.mainWebsite.secondaryCtaTargetId)}</span>
            </div>
            {state.mainWebsite.navigation.map((entry) => (
              <div key={entry.id} className="qc-link-row">
                <Badge tone={entry.isPrimary ? "sage" : "muted"}>תפריט</Badge>
                <strong>{entry.label}</strong>
                <Icon name="arrowLeft" size={14} />
                <span>{getTargetLabel(state, entry.targetId)}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function PubColumn({
  tone,
  icon,
  title,
  description,
  items,
  status,
  onPreview,
  onPrimary,
  primaryLabel,
  primaryIcon,
  onSecondary,
  secondaryLabel
}: {
  tone: "success" | "info" | "muted";
  icon: IconName;
  title: string;
  description: string;
  items: PublicSiteItem[];
  status: PublicSiteItemStatus;
  onPreview: (entity: PublicSiteItem) => void;
  onPrimary: (id: string) => void;
  primaryLabel: string;
  primaryIcon: IconName;
  onSecondary: (id: string) => void;
  secondaryLabel: string;
}) {
  return (
    <Card className={`qc-pub-col qc-pub-col--${tone}`} data-publish-column={status}>
      <CardHeader
        eyebrow={
          <span className="ds-row" style={{ gap: 6, alignItems: "center" }}>
            <Icon name={icon} size={14} />
            {items.length} פריטים
          </span>
        }
        title={title}
        subtitle={description}
      />
      <CardBody compact>
        {items.length === 0 ? (
          <div className="qc-pub-empty">
            <Icon name="checkCircle" size={20} />
            <span>אין פריטים בעמודה זו.</span>
          </div>
        ) : (
          <div className="ds-col ds-col--sm">
            {items.map((item) => (
              <div key={item.id} className="qc-pub-card" data-publish-item-id={item.id}>
                <div className="qc-pub-card__line">
                  <Icon name={pageTypeIcon[item.pageType]} size={16} />
                  <strong>{item.title}</strong>
                  <span
                    className="qc-pub-card__dot"
                    style={{ background: statusDotColor[status] }}
                    aria-hidden
                  />
                </div>
                <div className="qc-pub-card__meta">
                  <span>{pageTypeLabels[item.pageType]}</span>
                  <span>ֲ·</span>
                  <span>{relativeUpdated(item.updatedAt)}</span>
                </div>
                <div className="qc-pub-card__actions">
                  <Button size="sm" variant="ghost" iconStart={<Icon name="eye" size={12} />} onClick={() => onPreview(item)}>
                    תצוגה
                  </Button>
                  <Button
                    size="sm"
                    iconStart={<Icon name={primaryIcon} size={12} />}
                    onClick={() => onPrimary(item.id)}
                    data-publish-primary={item.id}
                  >
                    {primaryLabel}
                  </Button>
                  <Button
                    size="sm"
                    variant="subtle"
                    iconStart={<Icon name="folder" size={12} />}
                    onClick={() => onSecondary(item.id)}
                    data-publish-secondary={item.id}
                  >
                    {secondaryLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}






