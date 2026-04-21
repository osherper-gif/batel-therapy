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
import { mockContacts } from "../../mocks";

type Filter = "all" | "parent" | "external" | "framework";

const roleFilter = (role: string, f: Filter) => {
  if (f === "all") return true;
  if (f === "parent") return role.includes("אם") || role.includes("אב") || role.includes("הור");
  if (f === "framework") return role.includes("מסגרת") || role.includes("גן") || role.includes("בית ספר");
  if (f === "external") return !role.includes("אם") && !role.includes("אב") && !role.includes("הור") && !role.includes("מסגרת");
  return true;
};

export function ContactsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    return mockContacts.filter(
      (c) =>
        (!q || c.fullName.includes(q) || c.role.includes(q)) &&
        roleFilter(c.role, filter)
    );
  }, [query, filter]);

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="ארכיון"
        title="אנשי קשר"
        subtitle="כל ההורים, היועצות, המסגרות והאנשים המעורבים בטיפול."
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="download" size={16} />}
            >
              ייצוא
            </Button>
            <Button iconStart={<Icon name="plus" size={16} />}>
              איש קשר חדש
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
                placeholder="חיפוש לפי שם או תפקיד"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Segmented<Filter>
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "הכל" },
                { value: "parent", label: "הורים" },
                { value: "framework", label: "מסגרות" },
                { value: "external", label: "אנשי מקצוע" }
              ]}
            />
          </div>
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="users"
              title="לא נמצאו אנשי קשר"
              description="אפשר להוסיף איש קשר ולקשר אותו לאחד המטופלים."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-grid ds-grid--auto">
          {filtered.map((c) => (
            <Card key={c.id} style={{ cursor: "pointer" }}>
              <CardBody compact>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 10
                  }}
                >
                  <Avatar name={c.fullName} size="md" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontSize: "var(--text-base)" }}>
                      {c.fullName}
                    </strong>
                    <div className="ds-t-xs ds-t-muted">{c.role}</div>
                  </div>
                  <Badge tone="outline">{c.preferredLanguage || "—"}</Badge>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: "var(--text-sm)",
                    color: "var(--text-muted)",
                    paddingTop: 10,
                    borderTop: "1px dashed var(--border-soft)"
                  }}
                >
                  {c.phone ? (
                    <div>
                      <Icon
                        name="phone"
                        size={14}
                        style={{
                          verticalAlign: "-2px",
                          marginInlineEnd: 6
                        }}
                      />
                      {c.phone}
                    </div>
                  ) : null}
                  {c.email ? (
                    <div>
                      <Icon
                        name="mail"
                        size={14}
                        style={{
                          verticalAlign: "-2px",
                          marginInlineEnd: 6
                        }}
                      />
                      {c.email}
                    </div>
                  ) : null}
                  {c.address ? (
                    <div>
                      <Icon
                        name="globe"
                        size={14}
                        style={{
                          verticalAlign: "-2px",
                          marginInlineEnd: 6
                        }}
                      />
                      {c.address}
                    </div>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
