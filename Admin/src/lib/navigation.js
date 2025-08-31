import {
  LayoutDashboard,
  HandHeart,
  Truck,
  Boxes,
  Users,
  Building2,
  UserRound,
  BarChart3,
  Settings,
} from "lucide-react";

export const nav = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },

  {
    label: "Donations",
    icon: HandHeart,
    children: [
      { label: "All Donations", to: "/donations" },
      { label: "New Donation", to: "/donations/new" }, // <-- add this line
    ],
  },

  {
    label: "Pickups",
    icon: Truck,
    children: [{ label: "Pickup Requests", to: "/pickups" }],
  },
  {
    label: "Inventory",
    icon: Boxes,
    children: [{ label: "Stock", to: "/inventory" }],
  },
  {
    label: "Beneficiaries",
    icon: Users,
    children: [
      { label: "Shelters", to: "/beneficiaries/shelters" },
      { label: "Orders", to: "/beneficiaries/orders" },
    ],
  },
  {
    label: "Partners",
    icon: Building2,
    children: [
      { label: "NGOs", to: "/partners/ngos" },
      { label: "Donors", to: "/partners/donors" },
    ],
  },

  {
    label: "Volunteers",
    icon: UserRound,
    children: [
      
      { label: "Drivers", to: "/volunteers/drivers" },
    ],
  },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];
