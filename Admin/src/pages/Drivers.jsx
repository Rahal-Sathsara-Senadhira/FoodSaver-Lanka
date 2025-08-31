import React, { useState } from "react";
import Table from "@/components/Table";
import StatusPill from "@/components/StatusPill";

const drivers = [
  { id: "DRV-001", name: "Kasun Perera", vehicle: "Van", phone: "+94 77 555 1122", capacity: "60 meals", status: "Available" },
  { id: "DRV-002", name: "Ayesha Silva", vehicle: "Bike", phone: "+94 76 333 6677", capacity: "15 meals", status: "On Duty" },
  { id: "DRV-003", name: "Imran Nazeer", vehicle: "Car", phone: "+94 71 888 4455", capacity: "30 meals", status: "Offline" },
];

const availabilityToday = [
  { id: "DRV-001", name: "Kasun Perera", from: "18:30", to: "22:00", area: "Colombo 03" },
  { id: "DRV-003", name: "Imran Nazeer", from: "19:00", to: "23:30", area: "Colombo 05" },
];

const driverTrips = [
  { id: "TR-501", driver: "Kasun Perera", pickup: "Hilton Colombo", drop: "FSL Shelter A", time: "20:10", items: "40 meals" },
  { id: "TR-502", driver: "Ayesha Silva", pickup: "Cafe 34", drop: "FSL Shelter A", time: "19:40", items: "15 meals" },
];

export default function Drivers() {
  const [tab, setTab] = useState("roster");

  const tone = (s) => (s === "Available" ? "green" : s === "On Duty" ? "blue" : "slate");
  const callDriver = (r) => alert(`Calling ${r.name}`);
  const messageDriver = (r) => alert(`Message to ${r.name}`);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-6 text-sm border-b">
        {[
          { id: "roster", label: "Roster", count: drivers.length },
          { id: "availability", label: "Availability", count: availabilityToday.length },
          { id: "history", label: "History", count: driverTrips.length },
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`pb-3 -mb-px border-b-2 ${tab === id ? "border-blue-600 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            {label}
            <span className="ml-2 text-xs rounded-full bg-slate-100 text-slate-700 px-2 py-0.5">{count}</span>
          </button>
        ))}
      </div>

      {tab === "roster" && (
        <>
          <div className="mb-2 text-xs text-slate-500">
            Availability is controlled by drivers in their mobile app. Admins cannot toggle it.
          </div>
          <Table
            columns={[
              { key: "name", title: "Name" },
              { key: "vehicle", title: "Vehicle" },
              { key: "phone", title: "Phone" },
              { key: "capacity", title: "Capacity" },
              { key: "status", title: "Status", render: (v) => <StatusPill tone={tone(v)}>{v}</StatusPill> },
              {
                key: "actions",
                title: "Action",
                render: (_v, r) => (
                  <div className="flex gap-2">
                    <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => callDriver(r)}>
                      Call
                    </button>
                    <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => messageDriver(r)}>
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
              key: "actions",
              title: "Action",
              render: (_v, r) => (
                <div className="flex gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => callDriver(r)}>
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
  );
}
