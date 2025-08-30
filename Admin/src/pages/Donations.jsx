import React, { useState } from "react";
import Table from "../components/Table";
import StatusPill from "../components/StatusPill";
import { donorOffers, activePickups, donationHistory } from "../lib/mock";

export default function Donations() {
  const [tab, setTab] = useState("offers");
  const assignPickup = (row) => alert(`Assign driver for ${row.id} (${row.donor})`);
  const declineOffer = (row) => alert(`Declined ${row.id}`);
  const markPicked = (row) => alert(`Marked picked up: ${row.id}`);
  const reassign = (row) => alert(`Reassign ${row.id}`);
  const cancelPickup = (row) => alert(`Canceled ${row.id}`);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {/* Tabs */}
      <div className="px-5 pt-4">
        <nav className="flex items-center gap-6 text-sm">
          {[
            { id: "offers", label: "Offers", count: donorOffers.length },
            { id: "pickups", label: "Pickups", count: activePickups.length },
            { id: "history", label: "History", count: donationHistory.length },
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
        {tab === "offers" && (
          <Table
            columns={[
              { key: "id", title: "Offer ID" },
              { key: "donor", title: "Donor" },
              { key: "items", title: "Items" },
              { key: "readyBy", title: "Ready by" },
              { key: "address", title: "Pickup address" },
              { key: "status", title: "Status", render: (v) => <StatusPill tone="amber">{v}</StatusPill> },
              {
                key: "id",
                title: "Action",
                render: (v, r) => (
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => assignPickup(r)}
                    >
                      Assign pickup
                    </button>
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
                      onClick={() => declineOffer(r)}
                    >
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
              { key: "status", title: "Status", render: (v) => <StatusPill tone={v === "Assigned" ? "blue" : "amber"}>{v}</StatusPill> },
              {
                key: "id",
                title: "Action",
                render: (v, r) => (
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                      onClick={() => markPicked(r)}
                    >
                      Mark picked up
                    </button>
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
                      onClick={() => reassign(r)}
                    >
                      Reassign
                    </button>
                    <button
                      className="rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
                      onClick={() => cancelPickup(r)}
                    >
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
    </div>
  );
}
