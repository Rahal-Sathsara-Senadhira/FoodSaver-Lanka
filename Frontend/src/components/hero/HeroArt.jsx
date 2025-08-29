// src/components/hero/HeroArt.jsx
import assets from "../../assets/assets";

export default function HeroArt() {
  return (
    <div className="relative hidden md:block">
      {/* Big soft YELLOW DONUT glow (behind image, matches mock) */}
      <div
        className="
          pointer-events-none absolute right-[-40px] top-[-10px] z-0
          h-[560px] w-[560px] rounded-full
          bg-[radial-gradient(closest-side,rgba(250,204,21,0.45),rgba(250,204,21,0)_70%)]
        "
      />

      {/* Circular masked photo with softer, spread shadow */}
      <div
        className="
          relative z-10 h-[520px] w-[520px] overflow-hidden rounded-full
          shadow-[0_30px_80px_rgba(0,0,0,0.12)] ring-1 ring-black/5
        "
      >
        <img
          src={assets.HeroImage}
          alt="Food donation"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Two small bubbles overlapping lower-left of the photo */}
      <div className="absolute z-20 left-6 bottom-24 h-28 w-28 rounded-full bg-yellow-400" />
      <div className="absolute z-20 left-24 bottom-12 h-20 w-20 rounded-full bg-yellow-300" />
    </div>
  );
}
