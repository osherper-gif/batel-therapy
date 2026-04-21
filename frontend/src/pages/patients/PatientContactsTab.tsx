import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Avatar } from "../../design-system/Avatar";
import { Badge } from "../../design-system/Badge";
import { Button } from "../../design-system/Button";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { usePatientContext } from "../../layouts/PatientWorkspace";

export function PatientContactsTab() {
  const { patient } = usePatientContext();

  return (
    <div className="ds-col">
      <Card>
        <CardHeader
          title="אנשי קשר ומעורבים"
          subtitle="הורים, מסגרת חינוכית, אנשי מקצוע חיצוניים."
          actions={
            <Button iconStart={<Icon name="plus" size={16} />}>קישור איש קשר</Button>
          }
        />
        <CardBody>
          {patient.patientContacts.length === 0 ? (
            <EmptyState
              icon="users"
              title="עדיין לא קושרו אנשי קשר"
              description="אפשר לקשר הורים, יועצים, רופאים, או מסגרות חינוכיות."
            />
          ) : (
            <div className="ds-grid ds-grid--2">
              {patient.patientContacts.map((pc) => (
                <Card key={pc.id} variant="flat" style={{ border: "1px solid var(--border-soft)" }}>
                  <CardBody compact>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <Avatar name={pc.contact.fullName} size="md" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ fontSize: "var(--text-base)" }}>
                          {pc.contact.fullName}
                        </strong>
                        <div className="ds-t-xs ds-t-muted">
                          {pc.relationshipToPatient || pc.contact.role}
                        </div>
                      </div>
                      {pc.sharingConsent ? (
                        <Badge tone="success">שיתוף מאושר</Badge>
                      ) : (
                        <Badge tone="muted">ללא שיתוף</Badge>
                      )}
                    </div>
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: "var(--text-sm)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        color: "var(--text-muted)"
                      }}
                    >
                      {pc.contact.phone ? (
                        <div>
                          <Icon name="phone" size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 6 }} />
                          {pc.contact.phone}
                        </div>
                      ) : null}
                      {pc.contact.email ? (
                        <div>
                          <Icon name="mail" size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 6 }} />
                          {pc.contact.email}
                        </div>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
