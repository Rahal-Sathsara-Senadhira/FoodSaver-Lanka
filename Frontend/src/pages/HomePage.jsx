// src/pages/HomePage.jsx
import Hero from '../components/hero/Hero';
import TextSection from '../components/common/TextSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TextSection
        title="Together we make food go further"
        content="Every number below tells a story of meals saved, families fed, and waste prevented in Colombo"
        className="bg-white"
      />
    </>
  );
}
