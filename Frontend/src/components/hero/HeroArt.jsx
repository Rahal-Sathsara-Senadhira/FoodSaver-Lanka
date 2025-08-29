// src/components/hero/HeroArt.jsx
export default function HeroArt({ src }) {
  return (
    <div className="relative hidden md:block">
      <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-yellow-300/70 blur-0"></div>
      <img
        src={src}
        alt="Food donation"
        className="relative z-10 h-[360px] w-[360px] rounded-[50%] object-cover shadow-xl ring-1 ring-black/5"
      />
    </div>
  );
}
