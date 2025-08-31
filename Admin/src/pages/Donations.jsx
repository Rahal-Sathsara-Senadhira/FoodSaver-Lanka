import React, { useState } from "react";
import Table from "@/components/Table";
import StatusPill from "@/components/StatusPill";

const donorOffers = [
  { id: "OF-1009", donor: "Hilton Colombo", items: "25 food containers, 8 soup", readyBy: "21:30", address: "No. 2, Galle Face", status: "New" },
  { id: "OF-1010", donor: "FreshCo (Union Pl)", items: "10 food containers, 12 soup", readyBy: "21:45", address: "Union Pl, Colombo 02", status: "New" },
];

const activePickups = [
  { id: "PU-2201", donor: "Hilton Colombo", driver: "Kasun Perera", eta: "21:50", status: "Assigned" },
  { id: "PU-2202", donor: "FreshCo (Union Pl)", driver: "Ayesha Silva", eta: "22:05", status: "On route" },
];

const donationHistory = [
  { id: "DN-0301", donor: "Galle Face Hotel", receivedAt: "20:15", items: "40 cooked meals", driver: "Ruwan" },
  { id: "DN-0300", donor: "Cafe 34", receivedAt: "19:05", items: "15 cooked meals", driver: "Ayesha" },
];

export default function Donations() {
  const [tab, setTab] = useState("offers"); // offers | pickups | history

  const assignPickup = (row) => alert(`Assign driver for ${row.id} (${row.donor})`);
  const declineOffer = (row) => alert(`Declined ${row.id}`);
  const markPicked = (row) => alert(`Marked picked up: ${row.id}`);
  const reassign = (row) => alert(`Reassign ${row.id}`);
  const cancelPickup = (row) => alert(`Canceled ${row.id}`);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-6 text-sm border-b">
        {[
          { id: "offers", label: "Offers", count: donorOffers.length },
          { id: "pickups", label: "Pickups", count: activePickups.length },
          { id: "history", label: "History", count: donationHistory.length },
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

      {tab === "offers" && (
        <Table
          columns={[
            { key: "id", title: "Offer ID" },
            { key: "donor", title: "Donor" },
            { key: "items", title: "Items" },
            { key: "readyBy", title: "Ready by" },
            { key: "address", title: "Pickup address" },
            {
              key: "status",
              title: "Status",
              render: (v) => <StatusPill tone="amber">{v}</StatusPill>,
            },
            {
              key: "actions",
              title: "Action",
              render: (_v, r) => (
                <div className="flex gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white" onClick={() => assignPickup(r)}>
                    Assign pickup
                  </button>
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => declineOffer(r)}>
                    Decline
                  </button>
                </div>
              ),
            },
          ]}
          rows={donorOffers}
        />
      )}

      {tab === "pickups" && (
        <Table
          columns={[
            { key: "id", title: "Pickup ID" },
            { key: "donor", title: "Donor" },
            { key: "driver", title: "Driver" },
            { key: "eta", title: "ETA" },
            {
              key: "status",
              title: "Status",
              render: (v) => <StatusPill tone={v === "Assigned" ? "blue" : "amber"}>{v}</StatusPill>,
            },
            {
              key: "actions",
              title: "Action",
              render: (_v, r) => (
                <div className="flex gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium bg-green-600 text-white" onClick={() => markPicked(r)}>
                    Mark picked up
                  </button>
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => reassign(r)}>
                    Reassign
                  </button>
                  <button className="rounded-lg px-3 py-1.5 text-sm font-medium border" onClick={() => cancelPickup(r)}>
                    Cancel
                  </button>
                </div>
              ),
            },
          ]}
          rows={activePickups}
        />
      )}

      {tab === "history" && (
        <Table
          columns={[
            { key: "id", title: "Donation ID" },
            { key: "donor", title: "Donor" },
            { key: "receivedAt", title: "Received at" },
            { key: "items", title: "Items" },
            { key: "driver", title: "Driver" },
          ]}
          rows={donationHistory}
        />
      )}
    </div>
  );
}
