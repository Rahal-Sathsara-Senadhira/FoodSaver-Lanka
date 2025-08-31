// src/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import DonationsList from "./pages/Donations/List";
import NewDonation from "./pages/Donations/New";
import PickupsList from "./pages/Pickups/List";

import InventoryStock from "./pages/Inventory/List"; // Stock page
import BeneficiariesList from "./pages/Beneficiaries/List";
import PartnersList from "./pages/Partners/List";
import VolunteersList from "./pages/Volunteers/List";
import ReportsOverview from "./pages/Reports/Overview";
import SettingsGeneral from "./pages/Settings/General";
import BeneficiaryShelters from "./pages/Beneficiaries/Shelters.jsx";
import BeneficiaryOrders from "./pages/Beneficiaries/Orders.jsx";
import PartnersNGOs from "./pages/Partners/NGOs.jsx";
import PartnersDonors from "./pages/Partners/Donors.jsx";
import VolunteersDrivers from "./pages/Volunteers/Drivers.jsx";

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
      <Route path="/beneficiaries/shelters" element={<BeneficiaryShelters />} />
      <Route path="/beneficiaries/orders" element={<BeneficiaryOrders />} />

      {/* Partners */}
      <Route path="/partners" element={<PartnersList />} />
      <Route path="/partners/ngos" element={<PartnersNGOs />} />
      <Route path="/partners/donors" element={<PartnersDonors />} />

      {/* Volunteers */}
      <Route path="/volunteers" element={<VolunteersList />} />
      <Route path="/volunteers/drivers" element={<VolunteersDrivers />} />
      
      {/* Reports */}
      <Route path="/reports" element={<ReportsOverview />} />

      {/* Settings */}
      <Route path="/settings" element={<SettingsGeneral />} />

      {/* Fallback */}
      <Route path="*" element={<div className="p-6">Not Found</div>} />
    </Routes>
  );
}
