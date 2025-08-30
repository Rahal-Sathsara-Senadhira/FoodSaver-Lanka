import React from 'react';

export default function StatusPill({ status }){
  const map = {
    ready_for_pickup: 'bg-amber-100 text-amber-700',
    assigned: 'bg-indigo-100 text-indigo-700',
    collected: 'bg-sky-100 text-sky-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    packing: 'bg-slate-100 text-slate-700',
    ready: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${map[status] || 'bg-slate-100 text-slate-700'}`}>
      {String(status).replaceAll('_', ' ')}
    </span>
  );
}
