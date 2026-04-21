import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface EntityTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyText: string;
}

export function EntityTable<T>({ columns, rows, emptyText }: EntityTableProps<T>) {
  if (!rows.length) {
    return <p className="muted">{emptyText}</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
