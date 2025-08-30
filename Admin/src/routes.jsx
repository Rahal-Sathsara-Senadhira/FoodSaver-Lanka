import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DonationsList from './pages/Donations/List'
import PickupsList from './pages/Pickups/List'
import InventoryList from './pages/Inventory/List'
import BeneficiariesList from './pages/Beneficiaries/List'
import PartnersList from './pages/Partners/List'
import VolunteersList from './pages/Volunteers/List'
import ReportsOverview from './pages/Reports/Overview'
import SettingsGeneral from './pages/Settings/General'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/donations" element={<DonationsList />} />
      <Route path="/pickups" element={<PickupsList />} />
      <Route path="/inventory" element={<InventoryList />} />
      <Route path="/beneficiaries" element={<BeneficiariesList />} />
      <Route path="/partners" element={<PartnersList />} />
      <Route path="/volunteers" element={<VolunteersList />} />
      <Route path="/reports" element={<ReportsOverview />} />
      <Route path="/settings" element={<SettingsGeneral />} />
      <Route path="*" element={<div className="p-6">Not Found</div>} />
    </Routes>
  )
}
