
import React from "react";
import MainLogo from "../assets/MainLogo.png";

const navItems = [
  { label: "Overview", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
  ) },
  { label: "Approvals", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
  ) },
  { label: "Donations", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.24 3 12 4.5 12 4.5C12 4.5 12.76 3 14.5 3C17.5 3 20 5.5 20 8.5C20 13.5 12 21 12 21Z" /></svg>
  ) },
  { label: "Drivers", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="6" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ) },
  { label: "Distribution", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
  ) },
];

function OverviewGraphs() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-row gap-6 w-full">
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 min-w-[220px] flex flex-col items-start justify-center shadow-sm">
          <div className="text-gray-500 text-sm mb-1">Pending approvals</div>
          <div className="text-3xl font-bold mb-1">6</div>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 min-w-[220px] flex flex-col items-start justify-center shadow-sm">
          <div className="text-gray-500 text-sm mb-1">Donations today</div>
          <div className="text-3xl font-bold mb-1">2</div>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 min-w-[220px] flex flex-col items-start justify-center shadow-sm">
          <div className="text-gray-500 text-sm mb-1">Batches ready</div>
          <div className="text-3xl font-bold mb-1">1</div>
        </div>
      </div>
      <div className="flex flex-row gap-6 w-full mt-2">
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="font-medium mb-2">Food Rescued (kg) — last 7 days</div>
          {/* Placeholder for area chart */}
          <svg width="100%" height="120" viewBox="0 0 300 120">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4fd1c5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4fd1c5" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <polyline
              fill="url(#area)"
              stroke="#38b2ac"
              strokeWidth="2"
              points="0,80 50,60 100,70 150,50 200,80 250,100 300,90 300,120 0,120"
            />
            <polyline
              fill="none"
              stroke="#38b2ac"
              strokeWidth="2"
              points="0,80 50,60 100,70 150,50 200,80 250,100 300,90"
            />
            <g fontSize="10" fill="#888">
              <text x="0" y="115">Mon</text>
              <text x="50" y="115">Tue</text>
              <text x="100" y="115">Wed</text>
              <text x="150" y="115">Thu</text>
              <text x="200" y="115">Fri</text>
              <text x="250" y="115">Sat</text>
              <text x="270" y="115">Sun</text>
            </g>
          </svg>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center shadow-sm">
          <div className="font-medium mb-2">Package Types (today)</div>
          {/* Placeholder for pie chart */}
          <svg width="120" height="120" viewBox="0 0 32 32">
            <circle r="16" cx="16" cy="16" fill="#e6f7fa" />
            <path d="M16 16 L16 0 A16 16 0 0 1 29.2 24.6 Z" fill="#38b2ac" />
            <path d="M16 16 L29.2 24.6 A16 16 0 1 1 16 0 Z" fill="#319795" />
            <text x="22" y="8" fontSize="3" fill="#38b2ac">35</text>
            <text x="22" y="28" fontSize="3" fill="#319795">20</text>
          </svg>
          <div className="flex gap-2 mt-2 text-xs">
            <span className="flex items-center"><span className="w-3 h-3 bg-[#38b2ac] inline-block rounded-full mr-1" />Food Container</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-[#319795] inline-block rounded-full mr-1" />Soup Container</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-2 shadow-sm">
        <div className="font-medium mb-2">Quantity by District (today)</div>
        {/* Placeholder for bar chart */}
        <svg width="100%" height="80" viewBox="0 0 300 80">
          <rect x="0" y="30" width="60" height="40" fill="#2196f3" />
          <rect x="70" y="50" width="60" height="20" fill="#2196f3" />
          <rect x="140" y="40" width="60" height="30" fill="#2196f3" />
          <rect x="210" y="20" width="60" height="50" fill="#2196f3" />
        </svg>
      </div>
    </div>
  );
}


function ApprovalsTables() {
  return (
    <div className="flex flex-col gap-8">
      {/* NGOs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2"><span>🧑‍🤝‍🧑</span> NGOs</div>
        <table className="w-full text-sm">
          <thead className="bg-[#f6f8fa]">
            <tr>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Name</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">District</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Contact</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2 px-3">Hope & Harvest</td>
              <td className="py-2 px-3">Kandy</td>
              <td className="py-2 px-3">+94 72 222 9988</td>
              <td className="py-2 px-3 flex gap-2">
                <button className="bg-[#212733] text-white px-3 py-1 rounded">Approve</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-3">Central Care Collective</td>
              <td className="py-2 px-3">Matale</td>
              <td className="py-2 px-3">+94 72 444 1111</td>
              <td className="py-2 px-3 flex gap-2">
                <button className="bg-[#212733] text-white px-3 py-1 rounded">Approve</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Donors Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2"><span>🎁</span> Donors</div>
        <table className="w-full text-sm">
          <thead className="bg-[#f6f8fa]">
            <tr>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Name</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Type</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Contact</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2 px-3">Hilton Colombo</td>
              <td className="py-2 px-3">Hotel</td>
              <td className="py-2 px-3">+94 11 249 2492</td>
              <td className="py-2 px-3 flex gap-2">
                <button className="bg-[#212733] text-white px-3 py-1 rounded">Approve</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-3">FreshCo Super (Union Pl)</td>
              <td className="py-2 px-3">Supermarket</td>
              <td className="py-2 px-3">+94 71 000 1122</td>
              <td className="py-2 px-3 flex gap-2">
                <button className="bg-[#212733] text-white px-3 py-1 rounded">Approve</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Volunteer Drivers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2"><span>🚚</span> Volunteer Drivers</div>
        <table className="w-full text-sm">
          <thead className="bg-[#f6f8fa]">
            <tr>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Name</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Vehicle</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">District</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Phone</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2 px-3">Kasun Perera</td>
              <td className="py-2 px-3">Van</td>
              <td className="py-2 px-3">Colombo</td>
              <td className="py-2 px-3">+94 77 555 1122</td>
              <td className="py-2 px-3 flex gap-2">
                <button className="bg-[#212733] text-white px-3 py-1 rounded">Approve</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-3">Ayesha Silva</td>
              <td className="py-2 px-3">Bike</td>
              <td className="py-2 px-3">Kandy</td>
              <td className="py-2 px-3">+94 76 333 6677</td>
              <td className="py-2 px-3 flex gap-2">
                <button className="bg-[#212733] text-white px-3 py-1 rounded">Approve</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [selected, setSelected] = React.useState(0);
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top bar with logo, title, and subtitle */}
      <div className="w-full flex items-center gap-3 px-6 py-3 border-b bg-gradient-to-r from-[#fffbe6] to-white/80">
        <img src={MainLogo} alt="Logo" className="h-8 w-8 rounded-full border border-yellow-300 bg-white" />
        <span className="font-bold text-lg text-gray-800">Food Saver Lanka • Admin</span>
        <span className="ml-4 text-xs text-gray-500">Approve partners • Assign pickups • Manage distribution</span>
      </div>
      <div className="w-full flex justify-end px-8 mt-4">
        <a href="/" className="bg-[#212733] text-white px-5 py-2 rounded shadow hover:bg-[#343a40] transition">Go to Home Page</a>
      </div>
      <main className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-56 min-h-full bg-white border-r flex flex-col py-6 px-2 gap-2">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium transition-all text-base ${selected === i ? "bg-[#212733] text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setSelected(i)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        {/* Main content */}
        <section className="flex-1 p-8">
          {selected === 0 && <OverviewGraphs />}
          {selected === 1 && <ApprovalsTables />}
          {selected !== 0 && selected !== 1 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-xl">Coming soon...</div>
          )}
        </section>
      </main>
    </div>
  );
}
