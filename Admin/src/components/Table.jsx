import React from 'react';

export default function Table({ columns, rows, empty = 'No data' }){
  return (
    <div className="overflow-x-auto card">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left font-medium px-4 py-3">{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-slate-400 p-8">{empty}</td>
            </tr>
          ) : rows.map((r) => (
            <tr key={r.id} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 align-top">
                  {c.render ? c.render(r[c.key], r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
