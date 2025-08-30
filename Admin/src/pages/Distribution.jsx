import React, { useState } from "react";
import Table from "../components/Table";
import StatusPill from "../components/StatusPill";
import { shelterRequests, assignments } from "../lib/mock";

export default function Distribution() {
  const [tab, setTab] = useState("requests");
  const assignDeliveryFromRequest = (r) =>
    alert(`Assign delivery for ${r.id} → ${r.shelter}`);
  const reassignDriver = (r) => alert(`Reassign driver for ${r.id}`);
  const markDelivered = (r) => alert(`Mark delivered: ${r.id}`);
  const cancelDelivery = (r) => alert(`Cancel delivery ${r.id}`);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {/* Tabs */}
      <div className="px-5 pt-4">
        <nav className="flex items-center gap-6 text-sm">
          {[
            {
              id: "requests",
              label: "Requests",
              count: shelterRequests.length,
            },
            {
              id: "assignments",
              label: "Assignments",
              count: assignments.filter((a) => a.status !== "Delivered").length,
            },
            {
              id: "deliveries",
              label: "Deliveries",
              count: assignments.filter((a) => a.status === "Delivered").length,
            },
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
        {tab === "requests" && (
          <>
            <div className="mb-3 grid sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Pending Requests</p>
                <p className="text-xl font-semibold">{shelterRequests.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Live Deliveries</p>
                <p className="text-xl font-semibold">
                  {assignments.filter((a) => a.status !== "Delivered").length}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Delivered Today</p>
                <p className="text-xl font-semibold">
                  {assignments.filter((a) => a.status === "Delivered").length}
                </p>
              </div>
            </div>

            <Table
              columns={[
                { key: "id", title: "Request ID" },
                { key: "shelter", title: "Shelter" },
                { key: "requested", title: "Requested items" },
                {
                  key: "priority",
                  title: "Priority",
                  render: (v) => (
                    <StatusPill tone={v === "High" ? "amber" : "slate"}>{v}</StatusPill>
                  ),
                },
                { key: "neededBy", title: "Needed by" },
                {
                  key: "id",
                  title: "Action",
                  render: (v, r) => (
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => assignDeliveryFromRequest(r)}
                      >
                        Assign delivery
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={shelterRequests}
            />
          </>
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
              {
                key: "status",
                title: "Status",
                render: (v) => (
                  <StatusPill tone={v === "Delivered" ? "green" : "blue"}>{v}</StatusPill>
                ),
              },
              {
                key: "id",
                title: "Action",
                render: (v, r) => (
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
                      onClick={() => reassignDriver(r)}
                    >
                      Reassign driver
                    </button>
                    {r.status !== "Delivered" && (
                      <button
                        className="rounded-lg px-3 py-1.5 text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                        onClick={() => markDelivered(r)}
                      >
                        Mark delivered
                      </button>
                    )}
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
                      onClick={() => cancelDelivery(r)}
                    >
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
    </div>
  );
}
