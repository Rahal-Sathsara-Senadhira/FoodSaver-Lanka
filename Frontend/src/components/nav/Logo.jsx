import assets from "../../assets/assets";

// src/components/nav/Logo.jsx
export default function Logo() {
  return (
    <a href="#" className="flex items-center gap-3 font-extrabold text-xl">
      <img src={assets.MainLogo} alt="FoodSaver Lanka" className="h-9 sm:h-10" />
    </a>
  );
}
