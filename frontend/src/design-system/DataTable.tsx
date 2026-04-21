import { ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  width?: string;
  align?: "start" | "end" | "center";
}

interface Props<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getKey,
  onRowClick,
  empty,
  className
}: Props<T>) {
  return (
    <div className={["ds-table-wrap", className || ""].filter(Boolean).join(" ")}>
      <table className={["ds-table", onRowClick ? "ds-table--clickable" : ""].filter(Boolean).join(" ")}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.id}
                style={{ width: c.width, textAlign: c.align || "start" }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 0 }}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                {columns.map((c) => (
                  <td key={c.id} style={{ textAlign: c.align || "start" }}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
