import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Approvals from "./pages/Approvals";
import Donations from "./pages/Donations";
import Drivers from "./pages/Drivers";
import Distribution from "./pages/Distribution";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Topbar */}
      <Topbar />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 lg:ml-64">
        <Routes>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/distribution" element={<Distribution />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <footer className="max-w-7xl mx-auto px-4 md:px-6 pb-10 pt-4 text-xs text-slate-500 lg:ml-64">
        © {new Date().getFullYear()} Food Saver Lanka
      </footer>
    </div>
  );
}
