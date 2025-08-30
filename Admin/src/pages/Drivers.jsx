import React, { useState } from "react";
import Table from "../components/Table";
import StatusPill from "../components/StatusPill";
import { drivers, availabilityToday, driverTrips, statusTone } from "../lib/mock";

export default function Drivers() {
  const [tab, setTab] = useState("roster");
  const callDriver = (r) => alert(`Calling ${r.name}…`);
  const messageDriver = (r) => alert(`Message to ${r.name}`);
  const assignTask = (r) => alert(`Assign task to ${r.name}`);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {/* Tabs */}
      <div className="px-5 pt-4">
        <nav className="flex items-center gap-6 text-sm">
          {[
            { id: "roster", label: "Roster", count: drivers.length },
            { id: "availability", label: "Availability", count: availabilityToday.length },
            { id: "history", label: "History", count: driverTrips.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 -mb-px border-b-2 transition ${
                tab === t.id
                  ? "border-blue-600 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
              <span className="ml-2 text-xs rounded-full bg-slate-100 text-slate-700 px-2 py-0.5">
                {t.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-5 border-t border-slate-200">
        {tab === "roster" && (
          <>
            <div className="mb-3 text-xs text-slate-500">
              Availability is controlled by drivers in their mobile app. Admins cannot toggle it.
            </div>
            <Table
              columns={[
                { key: "name", title: "Name" },
                { key: "vehicle", title: "Vehicle" },
                { key: "phone", title: "Phone" },
                { key: "capacity", title: "Capacity" },
                { key: "status", title: "Status", render: (v) => <StatusPill tone={statusTone(v)}>{v}</StatusPill> },
                {
                  key: "id",
                  title: "Action",
                  render: (v, r) => (
                    <div className="flex gap-2">
                      <button className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50" onClick={() => callDriver(r)}>
                        Call
                      </button>
                      <button className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50" onClick={() => messageDriver(r)}>
                        Message
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={drivers}
            />
          </>
        )}

        {tab === "availability" && (
          <Table
            columns={[
              { key: "name", title: "Driver" },
              { key: "from", title: "From" },
              { key: "to", title: "To" },
              { key: "area", title: "Area" },
              {
                key: "id",
                title: "Action",
                render: (v, r) => (
                  <div className="flex gap-2">
                    <button className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700" onClick={() => assignTask(r)}>
                      Assign Task
                    </button>
                    <button className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50" onClick={() => callDriver(r)}>
                      Call
                    </button>
                  </div>
                ),
              },
            ]}
            rows={availabilityToday}
          />
        )}

        {tab === "history" && (
          <Table
            columns={[
              { key: "id", title: "Trip ID" },
              { key: "driver", title: "Driver" },
              { key: "pickup", title: "Pickup" },
              { key: "drop", title: "Drop" },
              { key: "time", title: "Time" },
              { key: "items", title: "Items" },
            ]}
            rows={driverTrips}
          />
        )}
      </div>
    </div>
  );
}
