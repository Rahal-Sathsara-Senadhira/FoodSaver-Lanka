import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BadgeCheck,
  HandHeart,
  Truck,
  Package,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/approvals", label: "Approvals", icon: BadgeCheck },
  { to: "/donations", label: "Donations", icon: HandHeart },
  { to: "/drivers", label: "Drivers", icon: Truck },
  { to: "/distribution", label: "Distribution", icon: Package },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-slate-100 z-40 border-r border-slate-800">
      <nav className="flex flex-col w-full py-4 gap-1 px-3">
        <div className="mb-3 px-2 text-sm font-semibold tracking-tight text-slate-200">
          FoodSaver Lanka
        </div>

        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`w-full h-11 rounded-lg px-3 flex items-center gap-3 text-sm transition
                ${active ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-slate-800 hover:text-white"}`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
