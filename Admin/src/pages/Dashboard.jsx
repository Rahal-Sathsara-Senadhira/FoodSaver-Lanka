import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { lineData, pkgData, PIE_COLORS } from "../lib/mock";

export default function Dashboard() {
  return (
    <>
      {/* STATS */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { title: "Donations today", value: 2 },
          { title: "Available drivers", value: 4 },
          { title: "Open pickups", value: 3 },
        ].map((k) => (
          <div key={k.title} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">{k.title}</p>
            <p className="text-2xl font-semibold mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="mt-6 grid md:grid-cols-12 gap-4">
        <div className="md:col-span-7 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="font-semibold mb-3">Food rescued (kg) — last 7 days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Line type="monotone" dataKey="kg" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-5 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="font-semibold mb-3">Package types (today)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pkgData} innerRadius={48} outerRadius={88} paddingAngle={2} dataKey="value">
                  {pkgData.map((e, i) => (
                    <Cell key={e.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-600">
            {pkgData.map((p, i) => (
              <li key={p.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
