import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Badge } from "../../design-system/Badge";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { SearchInput } from "../../design-system/SearchInput";
import { Segmented } from "../../design-system/Tabs";
import { usePatientContext } from "../../layouts/PatientWorkspace";

type Tab = "documents" | "artwork";

export function PatientDocumentsTab() {
  const { patient } = usePatientContext();
  const [tab, setTab] = useState<Tab>("documents");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (tab === "documents") {
      return patient.documents.filter(
        (d) => !q || d.title.includes(q) || (d.tags && d.tags.includes(q))
      );
    }
    return patient.images.filter(
      (i) => !q || i.title.includes(q) || (i.description && i.description.includes(q))
    );
  }, [patient.documents, patient.images, tab, query]);

  return (
    <div className="ds-col">
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
            <Segmented<Tab>
              value={tab}
              onChange={setTab}
              items={[
                { value: "documents", label: "מסמכים" },
                { value: "artwork", label: "עבודות אמנות" }
              ]}
            />
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchInput
                placeholder={tab === "documents" ? "חיפוש מסמך..." : "חיפוש יצירה..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button iconStart={<Icon name="upload" size={16} />}>
              {tab === "documents" ? "העלאת מסמך" : "העלאת תמונה"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={tab === "documents" ? "folder" : "image"}
              title={tab === "documents" ? "אין מסמכים עדיין" : "אין תמונות עדיין"}
              description={
                tab === "documents"
                  ? "טפסי הסכמה, אבחונים ודוחות חיצוניים יופיעו כאן."
                  : "כל עבודה שנבחרה להיות משותפת תופיע כאן עם תגיות ופרטים."
              }
            />
          </CardBody>
        </Card>
      ) : tab === "documents" ? (
        <div className="ds-grid ds-grid--2">
          {(filtered as typeof patient.documents).map((doc) => (
            <Card key={doc.id}>
              <CardBody>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "var(--clay-100)",
                      color: "var(--clay-700)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <Icon name="fileText" size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        alignItems: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      <strong style={{ fontSize: "var(--text-base)" }}>
                        {doc.title}
                      </strong>
                      <Badge tone="outline">{doc.documentType}</Badge>
                    </div>
                    <div className="ds-t-xs ds-t-muted" style={{ marginTop: 4 }}>
                      {doc.authorName || "—"} ·{" "}
                      {new Date(doc.uploadedAt).toLocaleDateString("he-IL")}
                    </div>
                    {doc.tags ? (
                      <div className="ds-chips" style={{ marginTop: 8 }}>
                        {doc.tags.split(",").map((t) => (
                          <Badge key={t} tone="muted">
                            {t.trim()}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <Button variant="subtle" size="sm" iconStart={<Icon name="eye" size={14} />}>
                    פתיחה
                  </Button>
                  <Button variant="ghost" size="sm" iconStart={<Icon name="download" size={14} />}>
                    הורדה
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className="ds-grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--space-4)"
          }}
        >
          {(filtered as typeof patient.images).map((img) => (
            <Card key={img.id}>
              <div
                style={{
                  height: 160,
                  background:
                    "linear-gradient(135deg, var(--sage-100), var(--clay-100))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--sage-600)"
                }}
              >
                <Icon name="image" size={34} />
              </div>
              <CardBody compact>
                <strong style={{ fontSize: "var(--text-sm)" }}>{img.title}</strong>
                <p className="ds-t-xs ds-t-muted" style={{ marginTop: 4 }}>
                  {img.description}
                </p>
                <div className="ds-t-xs ds-t-muted" style={{ marginTop: 8 }}>
                  {img.capturedAt
                    ? new Date(img.capturedAt).toLocaleDateString("he-IL")
                    : ""}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
