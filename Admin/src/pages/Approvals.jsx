import React, { useState } from "react";
import Table from "@/components/Table";
import StatusPill from "@/components/StatusPill";

const pendingNGOs = [
  { id: "ngo_app_01", name: "Hope & Harvest", district: "Colombo", contact: "+94 70 222 9988" },
  { id: "ngo_app_02", name: "Central Care Collective", district: "Colombo", contact: "+94 72 444 1111" },
];

const pendingDonors = [
  { id: "donor_app_11", name: "Hilton Colombo", type: "Hotel", contact: "+94 11 249 2492" },
  { id: "donor_app_12", name: "FreshCo Super (Union Pl)", type: "Supermarket", contact: "+94 71 000 1122" },
];

const pendingDrivers = [
  { id: "vol_001", name: "Kasun Perera", vehicle: "Van", district: "Colombo", phone: "+94 77 555 1122" },
  { id: "vol_002", name: "Ayesha Silva", vehicle: "Bike", district: "Colombo", phone: "+94 76 333 6677" },
];

export default function Approvals() {
  const [tab, setTab] = useState("ngos"); // ngos | donors | drivers

  const approve = (what, row) => alert(`Approved ${what}: ${row.name}`);
  const reject = (what, row) => alert(`Rejected ${what}: ${row.name}`);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-6 text-sm border-b">
        {[
          { id: "ngos", label: "NGOs", count: pendingNGOs.length },
          { id: "donors", label: "Donors", count: pendingDonors.length },
          { id: "drivers", label: "Drivers", count: pendingDrivers.length },
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

      {tab === "ngos" && (
        <Table
          columns={[
            { key: "name", title: "Name" },
            { key: "district", title: "District" },
            { key: "contact", title: "Contact" },
            {
              key: "actions", // <- unique!
              title: "Action",
              render: (_v, r) => (
                <div className="flex gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white" onClick={() => approve("NGO", r)}>
                    Approve
                  </button>
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => reject("NGO", r)}>
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
              key: "actions",
              title: "Action",
              render: (_v, r) => (
                <div className="flex gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white" onClick={() => approve("Donor", r)}>
                    Approve
                  </button>
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => reject("Donor", r)}>
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
              key: "actions",
              title: "Action",
              render: (_v, r) => (
                <div className="flex gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white" onClick={() => approve("Driver", r)}>
                    Approve
                  </button>
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => reject("Driver", r)}>
                    Reject
                  </button>
                </div>
              ),
            },
          ]}
          rows={pendingDrivers}
        />
      )}
    </div>
  );
}
