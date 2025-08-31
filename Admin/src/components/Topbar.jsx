import React from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";

const TITLES = {
  "/dashboard": "Dashboard",
  "/approvals": "Approvals",
  "/donations": "Donations",
  "/drivers": "Drivers",
  "/distribution": "Distribution",
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title =
    TITLES[
      Object.keys(TITLES).find((k) => pathname.startsWith(k)) ?? "/dashboard"
    ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3">
        <div className="font-semibold tracking-tight">
          Food Saver Lanka • {title}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search…"
              className="pl-9 pr-3 py-2 w-72 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button className="p-2 rounded-lg border border-slate-200 bg-white">
            <Bell className="w-5 h-5 text-slate-700" />
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-200 grid place-items-center text-slate-700">
            👤
          </div>
        </div>
      </div>
    </header>
  );
}
