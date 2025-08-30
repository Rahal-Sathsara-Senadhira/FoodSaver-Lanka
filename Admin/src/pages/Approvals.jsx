import React, { useState } from "react";
import Table from "../components/Table";
import {
  pendingNGOs,
  pendingDonors,
  pendingVolunteers,
} from "../lib/mock";

export default function Approvals() {
  const [tab, setTab] = useState("ngos");
  const approve = (kind, r) => alert(`Approved ${kind}: ${r.name || r.id}`);
  const reject = (kind, r) => alert(`Rejected ${kind}: ${r.name || r.id}`);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {/* Tabs */}
      <div className="px-5 pt-4">
        <nav className="flex items-center gap-6 text-sm">
          {[
            { id: "ngos", label: "NGOs", count: pendingNGOs.length },
            { id: "donors", label: "Donors", count: pendingDonors.length },
            { id: "drivers", label: "Drivers", count: pendingVolunteers.length },
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
        {tab === "ngos" && (
          <Table
            columns={[
              { key: "name", title: "Name" },
              { key: "district", title: "District" },
              { key: "contact", title: "Contact" },
              {
                key: "id",
                title: "Action",
                render: (v, r) => (
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => approve("NGO", r)}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
                      onClick={() => reject("NGO", r)}
                    >
                      Reject
                    </button>
                  </div>
                ),
              },
            ]}
            rows={pendingNGOs}
          />
        )}

        {tab === "donors" && (
          <Table
            columns={[
              { key: "name", title: "Name" },
              { key: "type", title: "Type" },
              { key: "contact", title: "Contact" },
              {
                key: "id",
                title: "Action",
                render: (v, r) => (
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => approve("Donor", r)}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
                      onClick={() => reject("Donor", r)}
                    >
                      Reject
                    </button>
                  </div>
                ),
              },
            ]}
            rows={pendingDonors}
          />
        )}

        {tab === "drivers" && (
          <Table
            columns={[
              { key: "name", title: "Name" },
              { key: "vehicle", title: "Vehicle" },
              { key: "district", title: "District" },
              { key: "phone", title: "Phone" },
              {
                key: "id",
                title: "Action",
                render: (v, r) => (
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => approve("Driver", r)}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
                      onClick={() => reject("Driver", r)}
                    >
                      Reject
                    </button>
                  </div>
                ),
              },
            ]}
            rows={pendingVolunteers}
          />
        )}
      </div>
    </div>
  );
}
