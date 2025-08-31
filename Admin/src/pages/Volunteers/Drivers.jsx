import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import BasePanel from "../../components/common/BasePanel";
import {
  useDrivers,
  useUpdateAvailability,
} from "../../hooks/useVolunteers.js";
import { Search } from "lucide-react";

function StatusDot({ status }) {
  const map = {
    AVAILABLE: "bg-emerald-500",
    BUSY: "bg-amber-500",
    OFFLINE: "bg-slate-400",
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        map[status] || "bg-slate-400"
      }`}
    />
  );
}

function StatusBadge({ status }) {
  const map = {
    AVAILABLE:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    BUSY: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    OFFLINE:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

export default function VolunteersDrivers() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");

  const { data, isLoading } = useDrivers({ q, status, vehicle, page: 1 });
  const rows = data?.data || [];
  const statuses = data?.meta?.statuses || [];
  const vehicles = data?.meta?.vehicles || [];

  const updateAvail = useUpdateAvailability();

  return (
    <div className="max-w-none w-full">
      <Breadcrumbs items={[{ label: "Volunteers" }, { label: "Drivers" }]} />
      <BasePanel
        title="Drivers"
        description="Volunteer drivers and their availability."
      >
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 w-full sm:w-96">
            <Search size={16} className="text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, phone or vehicle…"
              className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
          >
            <option value="">All status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
          >
            <option value="">All vehicles</option>
            {vehicles.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Driver</th>
                <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">
                  Availability
                </th>
                <th className="px-4 py-3 text-left font-medium">Last Active</th>
                <th className="px-4 py-3 text-left font-medium">Next Shift</th>
                {/* <th className="px-4 py-3 text-left font-medium">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-slate-500">
                    Loading drivers…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-slate-500">
                    No drivers found.
                  </td>
                </tr>
              ) : (
                rows.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusDot status={d.status} />
                        <div className="text-slate-900 dark:text-white font-medium">
                          {d.firstName} {d.lastName}
                        </div>
                        <div className="text-xs text-slate-500">
                          NIC {d.nic}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-900 dark:text-white">
                        {d.vehicleType}
                      </div>
                      <div className="text-xs text-slate-500">
                        {d.vehicleNo}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{d.phone}</div>
                      <div className="text-xs text-slate-500">{d.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3">
                      {d.lastActiveAt
                        ? new Date(d.lastActiveAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {d.nextShift?.start
                        ? new Date(d.nextShift.start).toLocaleString()
                        : "—"}
                    </td>
                    {/* <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <AvailabilityMenu
                        current={d.status}
                        onChange={(s) => updateAvail.mutate({ id: d.id, status: s })}
                        busy={updateAvail.isPending}
                      />
                    </div>
                  </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </BasePanel>
    </div>
  );
}

function AvailabilityMenu({ current, onChange, busy }) {
  const opts = ["AVAILABLE", "BUSY", "OFFLINE"];
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs text-slate-500">Set:</span>
      {opts.map((o) => (
        <button
          key={o}
          type="button"
          disabled={busy || o === current}
          onClick={() => onChange(o)}
          className={`px-2 py-1 rounded-md border text-xs ${
            o === current
              ? "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 cursor-default"
              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
