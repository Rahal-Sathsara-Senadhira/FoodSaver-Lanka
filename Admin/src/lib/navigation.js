import {
  LayoutDashboard,
  HandHeart,      // donation-like
  Truck,
  Boxes,
  Users,
  Building2,
  UserRound,
  BarChart3,
  Settings
} from 'lucide-react'

export const nav = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },

  {
    label: 'Donations',
    icon: HandHeart,
    children: [
      { label: 'All Donations', to: '/donations' },
    ]
  },
  {
    label: 'Pickups',
    icon: Truck,
    children: [
      { label: 'Pickup Requests', to: '/pickups' },
    ]
  },
  {
    label: 'Inventory',
    icon: Boxes,
    children: [
      { label: 'Stock', to: '/inventory' },
    ]
  },
  {
    label: 'Beneficiaries',
    icon: Users,
    children: [
      { label: 'Organizations / Individuals', to: '/beneficiaries' },
    ]
  },
  {
    label: 'Partners',
    icon: Building2,
    children: [
      { label: 'NGOs & Donors', to: '/partners' },
    ]
  },
  {
    label: 'Volunteers',
    icon: UserRound,
    children: [
      { label: 'Roster', to: '/volunteers' },
    ]
  },
  { label: 'Reports', to: '/reports', icon: BarChart3 },
  { label: 'Settings', to: '/settings', icon: Settings },
]
