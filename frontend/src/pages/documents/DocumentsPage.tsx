import { useMemo, useState } from "react";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { SearchInput } from "../../design-system/SearchInput";
import { Segmented } from "../../design-system/Tabs";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { mockDocuments, mockImages } from "../../mocks";
import { downloadJson, showPlaceholderMessage } from "../../lib/uiActions";

type View = "documents" | "artwork";
type Filter = "all" | "form" | "report" | "plan";

const docTypeTone = (value: string) => {
  if (value.includes("טופס")) return "info" as const;
  if (value.includes("דוח")) return "lavender" as const;
  if (value.includes("תכנית")) return "sage" as const;
  return "muted" as const;
};

export function DocumentsPage() {
  const [view, setView] = useState<View>("documents");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const documents = useMemo(() => {
    const normalizedQuery = query.trim();
    return mockDocuments.filter((document) => {
      const passQuery =
        !normalizedQuery ||
        document.title.includes(normalizedQuery) ||
        (document.patient?.fullName || "").includes(normalizedQuery) ||
        (document.tags || "").includes(normalizedQuery);
      const passFilter =
        filter === "all" ||
        (filter === "form" && document.documentType.includes("טופס")) ||
        (filter === "report" && document.documentType.includes("דוח")) ||
        (filter === "plan" && document.documentType.includes("תכנית"));
      return passQuery && passFilter;
    });
  }, [query, filter]);

  const artwork = useMemo(() => {
    const normalizedQuery = query.trim();
    return mockImages.filter(
      (image) => !normalizedQuery || image.title.includes(normalizedQuery) || (image.patient?.fullName || "").includes(normalizedQuery)
    );
  }, [query]);

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="ארכיון"
        title="מסמכים ויצירות"
        subtitle="כל המסמכים, התמונות והיצירות של המטופלים במקום אחד — מסודרים וקלים למציאה."
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="download" size={16} />}
              onClick={() =>
                downloadJson("batel-documents-export.json", {
                  exportedAt: new Date().toISOString(),
                  documents,
                  artwork
                })
              }
            >
              ייצוא
            </Button>
            <Button
              iconStart={<Icon name="upload" size={16} />}
              onClick={() =>
                showPlaceholderMessage("העלאה גלובלית דורשת בחירת מטופל. כרגע אפשר להעלות מסמך או תמונה מתוך כרטיס המטופל.")
              }
            >
              העלאת מסמך
            </Button>
          </>
        }
      />

      <Card>
        <CardBody compact>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchInput
                placeholder="חיפוש לפי שם מסמך, מטופל או תגיות..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Segmented<View>
              value={view}
              onChange={setView}
              items={[
                { value: "documents", label: "מסמכים" },
                { value: "artwork", label: "יצירות" }
              ]}
            />
            {view === "documents" ? (
              <Segmented<Filter>
                value={filter}
                onChange={setFilter}
                items={[
                  { value: "all", label: "הכל" },
                  { value: "form", label: "טפסים" },
                  { value: "report", label: "דוחות" },
                  { value: "plan", label: "תכניות" }
                ]}
              />
            ) : null}
          </div>
        </CardBody>
      </Card>

      {view === "documents" ? (
        documents.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon="fileText"
                title="לא נמצאו מסמכים"
                description="אפשר להעלות הסכמות, דוחות חיצוניים, תכניות טיפול ועוד."
              />
            </CardBody>
          </Card>
        ) : (
          <div className="ds-grid ds-grid--auto">
            {documents.map((document) => (
              <Card
                key={document.id}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  showPlaceholderMessage(
                    `פתיחת מסמך מלא מתוך המרכז הגלובלי תתווסף בהמשך. כרגע אפשר לנהל אותו מתוך כרטיס המטופל ${document.patient?.fullName || ""}.`
                  )
                }
              >
                <CardBody compact>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                    <div
                      style={{
                        width: 44,
                        height: 56,
                        borderRadius: "var(--radius-sm)",
                        background: "linear-gradient(160deg, var(--sage-50), var(--clay-50))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--sage-700)",
                        flexShrink: 0
                      }}
                    >
                      <Icon name="fileText" size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: "var(--text-base)", display: "block", lineHeight: 1.35 }}>{document.title}</strong>
                      <div className="ds-t-xs ds-t-muted" style={{ marginTop: 2 }}>
                        {document.authorName || "—"}
                      </div>
                    </div>
                    <Badge tone={docTypeTone(document.documentType)}>{document.documentType}</Badge>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                      paddingTop: 10,
                      borderTop: "1px dashed var(--border-soft)"
                    }}
                  >
                    <Avatar name={document.patient?.fullName} size="sm" />
                    <span className="ds-t-sm ds-t-muted">{document.patient?.fullName}</span>
                    <span className="ds-t-xs ds-t-faint" style={{ marginInlineStart: "auto" }}>
                      {new Date(document.uploadedAt).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )
      ) : artwork.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="image"
              title="אין יצירות בארכיון"
              description="ניתן להעלות תמונות של עבודות אמנות מהמפגשים עם תיוג אוטומטי לתהליך."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-grid ds-grid--4">
          {artwork.map((image) => (
            <Card
              key={image.id}
              style={{ cursor: "pointer" }}
              onClick={() =>
                showPlaceholderMessage(
                  `תצוגת יצירה מלאה תתווסף בהמשך. כרגע אפשר לנהל אותה מתוך כרטיס המטופל ${image.patient?.fullName || ""}.`
                )
              }
            >
              <div
                style={{
                  aspectRatio: "4 / 3",
                  background: "linear-gradient(135deg, var(--sage-100), var(--clay-100), var(--lavender-100))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)"
                }}
              >
                <Icon name="image" size={32} />
              </div>
              <CardBody compact>
                <strong style={{ fontSize: "var(--text-sm)", display: "block" }}>{image.title}</strong>
                <p className="ds-t-xs ds-t-muted" style={{ marginTop: 2 }}>
                  {image.patient?.fullName} ·{" "}
                  {image.capturedAt ? new Date(image.capturedAt).toLocaleDateString("he-IL") : ""}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
