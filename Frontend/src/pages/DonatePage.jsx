// src/pages/DonatePage.jsx
import { useState } from 'react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Logo from '../components/nav/Logo';

export default function DonatePage() {
  const [active, setActive] = useState('new'); // 'new' | 'pending' | 'history' | 'profile'

  const SidebarItem = ({ children, id }) => (
    <button
      onClick={() => setActive(id)}
      className={`w-full text-left px-4 py-2 rounded-sm focus:outline-none transition-colors ${
        active === id ? 'bg-yellow-500 text-black font-bold' : 'text-gray-900'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Left sidebar */}
        <aside className="w-64 bg-yellow-400 min-h-screen p-6">
          <div className="mb-8">
            <Logo />
          </div>
          <nav className="space-y-2 text-gray-900 font-semibold">
            <SidebarItem id="dashboard">Dashboard</SidebarItem>
            <div>
              <div className="px-4 py-2 text-lg font-semibold">Donate</div>
              <div className="ml-2 mt-2 space-y-1">
                <SidebarItem id="new">new Donation</SidebarItem>
                <SidebarItem id="pending">Pending Donation</SidebarItem>
              </div>
            </div>
            <SidebarItem id="history">History</SidebarItem>
            <SidebarItem id="profile">Profile</SidebarItem>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <header className="border-b py-6 px-10 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Donor Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Welcome, Rahal</div>
              <div className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
          </header>

          <Container className="py-8">
            {active === 'new' && (
              <>
                <h2 className="text-xl font-semibold mb-6">New Donation</h2>

                <section className="bg-white">
                  <div className="mb-8">
                    <h3 className="font-semibold mb-3">Ready for Delivery</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <input className="border rounded px-3 py-2" placeholder="Date" />
                      <input className="border rounded px-3 py-2" placeholder="Time" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Packages</h4>
                    <div className="bg-gray-100 p-6 rounded">
                      <strong>Important</strong>
                      <p className="mt-3 text-sm text-gray-700">Each container that provides from the NGO need to filled with at least 250g of food.</p>
                      <p className="mt-1 text-sm text-gray-700">Each soup container that provides from the NGO need to filled with at least 150ml of food.</p>
                    </div>
                  </div>

                  {/* Updated form row: use 12-column grid so Type/Qty/Description align properly */}
                  <div className="mb-8 bg-white border rounded p-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <label className="col-span-2 text-sm text-gray-700">Type</label>
                      <div className="col-span-4">
                        <select className="w-full border rounded px-3 py-2">
                          <option>Food Container</option>
                          <option>Soup Container</option>
                        </select>
                      </div>

                      <label className="col-span-1 text-sm text-gray-700 text-right">Qty</label>
                      <div className="col-span-2">
                        <input className="w-full border rounded px-3 py-2" placeholder="Qty" />
                      </div>

                      <label className="col-span-1 text-sm text-gray-700">Description</label>
                      <div className="col-span-5">
                        <input className="w-full border rounded px-3 py-2" placeholder="eg: Fried rice with chopcie" />
                      </div>

                      <div className="col-span-1 text-right">
                        <button className="text-red-500 text-xl font-bold leading-none">×</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <Button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                        <span className="text-2xl leading-none">+</span>
                        <span className="-mt-0.5">Add</span>
                      </Button>

                      <Button className="bg-purple-600 text-white px-6 py-3 rounded">Donate</Button>
                    </div>
                  </div>

                </section>
              </>
            )}

            {active === 'pending' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Pending Donation</h2>

                <div className="bg-white border rounded p-6">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-gray-600">
                        <th className="py-4">Order No</th>
                        <th className="py-4">Order Id</th>
                        <th className="py-4">Donations</th>
                        <th className="py-4">Arriving Time</th>
                        <th className="py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-6 align-top">1</td>
                        <td className="py-6 align-top">DN-0235796</td>
                        <td className="py-6 align-top">
                          <div>25 Food containers</div>
                          <div className="mt-1">8 Soup containers</div>
                        </td>
                        <td className="py-6 align-top">9.30 p.m</td>
                        <td className="py-6 align-top">Ready to deliver</td>
                      </tr>

                      <tr className="border-t">
                        <td className="py-6 align-top">2</td>
                        <td className="py-6 align-top">DN-0235231</td>
                        <td className="py-6 align-top">
                          <div>10 Food containers</div>
                          <div className="mt-1">12 Soup containers</div>
                        </td>
                        <td className="py-6 align-top">9.40 p.m</td>
                        <td className="py-6 align-top">Ready to deliver</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {active === 'history' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Donation History</h2>
                <p className="text-gray-700">No history to show yet.</p>
              </>
            )}

            {active === 'profile' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Profile</h2>
                <p className="text-gray-700">Profile details go here.</p>
              </>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
}
