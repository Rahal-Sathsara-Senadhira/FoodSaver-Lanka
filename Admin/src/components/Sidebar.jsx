import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BadgeCheck,
  HandHeart,
  Truck,
  Package,
} from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/approvals", label: "Approvals", icon: BadgeCheck },
  { to: "/donations", label: "Donations", icon: HandHeart },
  { to: "/drivers", label: "Drivers", icon: Truck },
  { to: "/distribution", label: "Distribution", icon: Package },
];

export default function Sidebar() {
  return (
    // Full-height rail so it stays the full viewport
    <div className="h-screen flex flex-col text-black">
      {/* Brand */}
      <div className="p-4 font-semibold flex items-center gap-2">
        <HandHeart className="w-5 h-5" />
        FoodSaver Lanka
      </div>

      {/* Nav (use flex so items don't stretch vertically) */}
      <nav className="bg-amber-400/90 p-2 flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "h-11 px-3 inline-flex items-center w-full rounded-xl font-medium transition",
                isActive ? "bg-amber-500 shadow-inner" : "hover:bg-amber-300/70",
              ].join(" ")
            }
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
