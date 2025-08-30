import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function App() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* SIDEBAR (sticky on desktop) */}
      <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-amber-400">
          <Sidebar />
        </div>
      </aside>

      {/* MAIN */}
      <div className="col-span-12 lg:col-span-9 xl:col-span-10">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Outlet key={pathname} />
        </main>
        <footer className="max-w-7xl mx-auto px-4 pb-10 pt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Food Saver Lanka • Admin
        </footer>
      </div>
    </div>
  );
}
