// src/pages/HomePage.jsx

import Hero from '../components/hero/Hero';
import TextSection from '../components/common/TextSection';
import StatsRow from '../components/common/StatsRow';
import ThreeStep from '../components/common/ThreeStep';
import PartnersSection from '../components/common/PartnersSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="w-full flex justify-end px-8 mt-4">
        <a href="/admin" className="bg-[#212733] text-white px-5 py-2 rounded shadow hover:bg-[#343a40] transition">Go to Admin Panel</a>
      </div>
      <TextSection
        title="Together we make food go further"
        content="Every number below tells a story of meals saved, families fed, and waste prevented in Colombo"
        className="bg-white"
      />
      <StatsRow />
      <ThreeStep />
      <PartnersSection />
    </>
  );
}
