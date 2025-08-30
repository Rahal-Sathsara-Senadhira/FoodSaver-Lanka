import React from 'react';
import { HandHeart } from 'lucide-react';

export default function Header(){
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 border-b border-amber-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black/10 grid place-items-center">
            <HandHeart className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-black">Food Saver Lanka • Admin</h1>
            <p className="text-xs text-black/70">Approve partners • Assign pickups • Manage distribution</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 text-sm text-black/80">
          <span>Welcome, <b>Coordinator</b></span>
          <span className="w-8 h-8 rounded-full bg-black/10 inline-flex items-center justify-center">👤</span>
        </div>
      </div>
    </header>
  );
}
