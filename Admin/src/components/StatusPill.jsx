import React from "react";

export default function StatusPill({ tone = "blue", children }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}
