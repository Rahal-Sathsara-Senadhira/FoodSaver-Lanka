// src/components/nav/MobileMenu.jsx
import { useState } from 'react';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

export default function MobileMenu({ links = [] }) {
  const [open, setOpen] = useState(false);
  useLockBodyScroll(open);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        aria-label="Open menu"
      >
        ☰
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <nav
            className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold">Menu</span>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-gray-100">✕</button>
            </div>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="block rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-100">
                    {l.label}
                  </a>
                </li>
              ))}
              <li><a href="#signup" className="mt-2 inline-block rounded-full bg-black px-4 py-2 text-white">Sign up</a></li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
