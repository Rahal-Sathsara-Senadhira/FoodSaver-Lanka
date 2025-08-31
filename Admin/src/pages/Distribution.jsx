import React, { useState } from "react";
import Table from "@/components/Table";
import StatusPill from "@/components/StatusPill";

const shelterRequests = [
  { id: "RQ-7001", shelter: "FSL Shelter A", requested: "80 cooked meals", priority: "High", neededBy: "22:30" },
  { id: "RQ-7002", shelter: "FSL Shelter B", requested: "40 cooked meals", priority: "Normal", neededBy: "Tomorrow 10:00" },
];

const assignments = [
  { id: "AS-9001", from: "Hilton Colombo", to: "FSL Shelter A", items: "80 cooked meals", driver: "Kasun Perera", eta: "23:10", status: "Out for delivery" },
  { id: "AS-9000", from: "FreshCo (Union Pl)", to: "FSL Shelter B", items: "40 cooked meals", driver: "Ayesha Silva", eta: "Delivered 20:45", status: "Delivered" },
];

export default function Distribution() {
  const [tab, setTab] = useState("requests"); // requests | assignments | deliveries

  const assignDeliveryFromRequest = (row) => alert(`Assign delivery for ${row.id} → ${row.shelter}`);
  const reassignDriver = (row) => alert(`Reassign driver for ${row.id}`);
  const markDeliveredDelivery = (row) => alert(`Mark delivered: ${row.id}`);
  const cancelDelivery = (row) => alert(`Cancel delivery ${row.id}`);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-6 text-sm border-b">
        {[
          { id: "requests", label: "Requests", count: shelterRequests.length },
          { id: "assignments", label: "Assignments", count: assignments.filter((a) => a.status !== "Delivered").length },
          { id: "deliveries", label: "Deliveries", count: assignments.filter((a) => a.status === "Delivered").length },
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

      {tab === "requests" && (
        <Table
          columns={[
            { key: "id", title: "Request ID" },
            { key: "shelter", title: "Shelter" },
            { key: "requested", title: "Requested items" },
            { key: "priority", title: "Priority", render: (v) => <StatusPill tone={v === "High" ? "amber" : "slate"}>{v}</StatusPill> },
            { key: "neededBy", title: "Needed by" },
            {
              key: "actions",
              title: "Action",
              render: (_v, r) => (
                <div className="flex gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white" onClick={() => assignDeliveryFromRequest(r)}>
                    Assign delivery
                  </button>
                </div>
              ),
            },
          ]}
          rows={shelterRequests}
        />
      )}

      {tab === "assignments" && (
        <Table
          columns={[
            { key: "id", title: "Assignment ID" },
            { key: "from", title: "From (Donor)" },
            { key: "to", title: "To (Shelter)" },
            { key: "items", title: "Items" },
            { key: "driver", title: "Driver" },
            { key: "eta", title: "ETA" },
            { key: "status", title: "Status", render: (v) => <StatusPill tone={v === "Delivered" ? "green" : "blue"}>{v}</StatusPill> },
            {
              key: "actions",
              title: "Action",
              render: (_v, r) => (
                <div className="flex gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => reassignDriver(r)}>
                    Reassign driver
                  </button>
                  {r.status !== "Delivered" && (
                    <button className="rounded-lg px-3 py-1.5 text-sm font-medium bg-green-600 text-white" onClick={() => markDeliveredDelivery(r)}>
                      Mark delivered
                    </button>
                  )}
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => cancelDelivery(r)}>
                    Cancel
                  </button>
                </div>
              ),
            },
          ]}
          rows={assignments}
        />
      )}

      {tab === "deliveries" && (
        <Table
          columns={[
            { key: "id", title: "Delivery ID" },
            { key: "from", title: "From (Donor)" },
            { key: "to", title: "To (Shelter)" },
            { key: "items", title: "Items" },
            { key: "driver", title: "Driver" },
            { key: "eta", title: "Delivered at" },
            { key: "status", title: "Status", render: (v) => <StatusPill tone="green">{v}</StatusPill> },
          ]}
          rows={assignments.filter((a) => a.status === "Delivered")}
        />
      )}
    </div>
  );
}
