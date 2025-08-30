import React, { useMemo } from 'react';
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { donations, drivers, donationOffers } from '../lib/mock';

const COLORS = ['#0ea5e9', '#10b981', '#f97316', '#6366f1', '#7c3aed'];

export default function DashboardPage(){
  const donationsSeries = donations;
  const donationsToday = donationOffers.length;

  const packageBreakdown = useMemo(() => {
    const map = {};
    donationOffers.forEach(d => d.packages?.forEach(p => {
      map[p.type] = (map[p.type] || 0) + p.qty;
    }));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const pickupStatusSeries = useMemo(() => {
    const ready = donationOffers.filter(d=>d.status==='ready_for_pickup').length;
    const assigned = donationOffers.filter(d=>d.status==='assigned').length;
    const collected = donationOffers.filter(d=>d.status==='collected').length;
    return [{ status: 'Ready', count: ready }, { status: 'Assigned', count: assigned }, { status: 'Collected', count: collected }];
  }, []);

  const availableDrivers = drivers.filter(d=>d.status==='available').length;

  return (
    <div className="grid gap-6">
      <div className="grid sm:grid-cols-3 gap-3">
        <button className="btn btn-primary">+ New Batch</button>
        <button className="btn border border-violet-200 hover:bg-violet-50">Broadcast Driver Call</button>
        <button className="btn border border-amber-300 hover:bg-amber-50">View Donor Offers</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5"><p className="text-sm text-slate-500">Donations today</p><p className="text-2xl font-semibold">{donationsToday}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Available drivers</p><p className="text-2xl font-semibold">{availableDrivers}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Open pickups</p><p className="text-2xl font-semibold">{pickupStatusSeries[0].count}</p></div>
      </div>

      <div className="grid md:grid-cols-12 gap-4">
        <div className="card p-5 md:col-span-7">
          <h3 className="font-semibold mb-3">Food Rescued (kg) — last 7 days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationsSeries} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="kgFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="kg" stroke="#7c3aed" fillOpacity={1} fill="url(#kgFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 md:col-span-5">
          <h3 className="font-semibold mb-3">Package Types (today)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={packageBreakdown} dataKey="value" nameKey="name" outerRadius={90} label>
                  {packageBreakdown.map((e, i) => (<Cell key={e.name} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Operations Snapshot (Today — Colombo)</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2 text-slate-600">Pickup Pipeline</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={pickupStatusSeries} margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="status" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[8,8,8,8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-sm mb-2 text-slate-600">Driver Availability</p>
            <ul className="space-y-3">
              {['Available','Busy'].map((label) => {
                const total = drivers.length || 1;
                const value = label==='Available'
                  ? drivers.filter(d=>d.status==='available').length
                  : drivers.filter(d=>d.status!=='available').length;
                const pct = Math.round((value/total)*100);
                return (
                  <li key={label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{label}</span><span className="text-slate-500">{value} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${label==='Available' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width: pct + '%'}} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
