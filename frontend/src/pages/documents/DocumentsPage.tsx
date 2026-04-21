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

type View = "documents" | "artwork";
type Filter = "all" | "form" | "report" | "plan";

const docTypeTone = (t: string) => {
  if (t.includes("טופס")) return "info" as const;
  if (t.includes("דוח")) return "lavender" as const;
  if (t.includes("תכנית")) return "sage" as const;
  return "muted" as const;
};

export function DocumentsPage() {
  const [view, setView] = useState<View>("documents");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const documents = useMemo(() => {
    const q = query.trim();
    return mockDocuments.filter((d) => {
      const passQ =
        !q ||
        d.title.includes(q) ||
        (d.patient?.fullName || "").includes(q) ||
        (d.tags || "").includes(q);
      const passF =
        filter === "all" ||
        (filter === "form" && d.documentType.includes("טופס")) ||
        (filter === "report" && d.documentType.includes("דוח")) ||
        (filter === "plan" && d.documentType.includes("תכנית"));
      return passQ && passF;
    });
  }, [query, filter]);

  const artwork = useMemo(() => {
    const q = query.trim();
    return mockImages.filter(
      (img) =>
        !q ||
        img.title.includes(q) ||
        (img.patient?.fullName || "").includes(q)
    );
  }, [query]);

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="ארכיון"
        title="מסמכים ויצירות"
        subtitle="כל המסמכים, התמונות והיצירות של המטופלים במקום אחד — מסודרים וקלים למצוא."
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="download" size={16} />}
            >
              ייצוא
            </Button>
            <Button iconStart={<Icon name="upload" size={16} />}>
              העלאת מסמך
            </Button>
          </>
        }
      />

      <Card>
        <CardBody compact>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchInput
                placeholder="חיפוש לפי שם מסמך, מטופל, תגיות..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
                description="אפשר להעלות הסכמות, דוחות חיצוניים, תכניות טיפול וכו'."
              />
            </CardBody>
          </Card>
        ) : (
          <div className="ds-grid ds-grid--auto">
            {documents.map((d) => (
              <Card key={d.id} style={{ cursor: "pointer" }}>
                <CardBody compact>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      marginBottom: 10
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 56,
                        borderRadius: "var(--radius-sm)",
                        background:
                          "linear-gradient(160deg, var(--sage-50), var(--clay-50))",
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
                      <strong
                        style={{
                          fontSize: "var(--text-base)",
                          display: "block",
                          lineHeight: 1.35
                        }}
                      >
                        {d.title}
                      </strong>
                      <div
                        className="ds-t-xs ds-t-muted"
                        style={{ marginTop: 2 }}
                      >
                        {d.authorName || "—"}
                      </div>
                    </div>
                    <Badge tone={docTypeTone(d.documentType)}>
                      {d.documentType}
                    </Badge>
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
                    <Avatar name={d.patient?.fullName} size="sm" />
                    <span className="ds-t-sm ds-t-muted">
                      {d.patient?.fullName}
                    </span>
                    <span className="ds-t-xs ds-t-faint" style={{ marginInlineStart: "auto" }}>
                      {new Date(d.uploadedAt).toLocaleDateString("he-IL")}
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
              description="ניתן להעלות תמונות של עבודות אומנות מהמפגשים — עם תיוג אוטומטי לתהליך."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-grid ds-grid--4">
          {artwork.map((img) => (
            <Card key={img.id} style={{ cursor: "pointer" }}>
              <div
                style={{
                  aspectRatio: "4 / 3",
                  background:
                    "linear-gradient(135deg, var(--sage-100), var(--clay-100), var(--lavender-100))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)"
                }}
              >
                <Icon name="image" size={32} />
              </div>
              <CardBody compact>
                <strong style={{ fontSize: "var(--text-sm)", display: "block" }}>
                  {img.title}
                </strong>
                <p className="ds-t-xs ds-t-muted" style={{ marginTop: 2 }}>
                  {img.patient?.fullName} ·{" "}
                  {img.capturedAt
                    ? new Date(img.capturedAt).toLocaleDateString("he-IL")
                    : ""}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
