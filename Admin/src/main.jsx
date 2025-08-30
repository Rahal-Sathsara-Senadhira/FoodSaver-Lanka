import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import DashboardPage from "./pages/DashboardPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import DonationsPage from "./pages/DonationsPage";
import DriversPage from "./pages/DriversPage";
import DistributionPage from "./pages/DistributionPage";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<DashboardPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="donations" element={<DonationsPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="distribution" element={<DistributionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
