// src/routes.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import DonationsList from './pages/Donations/List'
import NewDonation from './pages/Donations/New'
import PickupsList from './pages/Pickups/List'

import InventoryStock from './pages/Inventory/List'   // Stock page
import BeneficiariesList from './pages/Beneficiaries/List'
import PartnersList from './pages/Partners/List'
import VolunteersList from './pages/Volunteers/List'
import ReportsOverview from './pages/Reports/Overview'
import SettingsGeneral from './pages/Settings/General'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      {/* Donations */}
      <Route path="/donations" element={<DonationsList />} />
      <Route path="/donations/new" element={<NewDonation />} />

      {/* Pickups */}
      <Route path="/pickups" element={<PickupsList />} />

      {/* Inventory */}
      <Route path="/inventory" element={<InventoryStock />} />

      {/* Beneficiaries */}
      <Route path="/beneficiaries" element={<BeneficiariesList />} />

      {/* Partners */}
      <Route path="/partners" element={<PartnersList />} />

      {/* Volunteers */}
      <Route path="/volunteers" element={<VolunteersList />} />

      {/* Reports */}
      <Route path="/reports" element={<ReportsOverview />} />

      {/* Settings */}
      <Route path="/settings" element={<SettingsGeneral />} />

      {/* Fallback */}
      <Route path="*" element={<div className="p-6">Not Found</div>} />
    </Routes>
  )
}
