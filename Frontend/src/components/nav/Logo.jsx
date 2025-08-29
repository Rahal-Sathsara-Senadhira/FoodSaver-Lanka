import assets from "../../assets/assets";

// src/components/nav/Logo.jsx
export default function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 font-extrabold text-xl">
      <img src={assets.MainLogo} alt="" className="h-10"/>
    </a>
  );
}
