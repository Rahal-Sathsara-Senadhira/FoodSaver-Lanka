import React from "react";

/**
 * Minimal data table.
 * - columns: [{ key, title, render?, dataIndex? }]
 *   Use a UNIQUE `key` for each column (e.g. "actions" for buttons).
 *   If the data field is different from the column key, pass `dataIndex`.
 * - rows: [{ id: string, ... }]
 * - rowKey: which field to use as the React key for each row (default "id")
 */
export default function Table({ columns, rows, empty = "No data", rowKey = "id" }) {
  // Dev guards to catch common mistakes early
  if (import.meta?.env?.DEV) {
    const keys = columns.map((c) => c.key);
    const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
    if (dupes.length) console.error("Table: duplicate column keys:", dupes);
    if (!rows.every((r) => r?.[rowKey] != null)) {
      console.error(`Table: some rows are missing rowKey "${rowKey}"`);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left font-medium px-4 py-3">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-slate-400 p-8">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r[rowKey]} className="border-t">
                {columns.map((c) => {
                  const dataKey = c.dataIndex ?? c.key; // allow different field vs key
                  return (
                    <td key={c.key} className="px-4 py-3 align-top">
                      {c.render ? c.render(r[dataKey], r) : r[dataKey]}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
