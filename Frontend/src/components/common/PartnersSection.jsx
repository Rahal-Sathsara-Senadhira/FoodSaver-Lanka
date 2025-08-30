
import React from "react";
import hilton from "../../assets/hilton.png";
import galadari from "../../assets/Galadari.png";
import crab from "../../assets/ministryofcrabs.png";
import melbourne from "../../assets/melbourne.png";
import vincafe from "../../assets/vincafe.png";
import tajsamudra from "../../assets/Tajsamudra.png";
import thenitic from "../../assets/thenitic.png";
import ImpactStatsCards from "./ImpactStatsCards";

const partners = [
  { src: melbourne, alt: "Upali's by Nawaloka" },
  { src: hilton, alt: "Hilton" },
  { src: galadari, alt: "Galadari" },
  { src: crab, alt: "Ministry of Crab" },
  { src: vincafe, alt: "VinaCafe" },
  { src: tajsamudra, alt: "Taj Samudra" },
  { src: thenitic, alt: "The Nittic" },
];

export default function PartnersSection() {
  return (
    <section className="w-full py-12 bg-white flex flex-col items-center">
      <div className="text-center mb-8">
        <div className="text-gray-500 text-sm mb-1">Partners</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Proud to collaborate with Sri Lankan food heroes
        </h2>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-x-16 gap-y-8 max-w-5xl mb-12">
        {partners.map((p, i) => (
          <img
            key={i}
            src={p.src}
            alt={p.alt}
            className="h-20 md:h-24 object-contain max-w-[180px]"
            style={{ flex: "1 0 120px", minWidth: 120 }}
          />
        ))}
      </div>
      <div className="text-center mt-8">
        <div className="text-gray-500 text-sm mb-1">Impact</div>
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Real change in Colombo</h3>
        <div className="text-gray-400 text-base">Track what our community achieves together</div>
      </div>
      <ImpactStatsCards />
    </section>
  );
}
