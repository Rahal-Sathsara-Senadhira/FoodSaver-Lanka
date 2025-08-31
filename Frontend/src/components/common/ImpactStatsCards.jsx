import React from "react";
import picture1 from "../../assets/picture1.jpg";
import picture2 from "../../assets/picture2.jpg";

const stats = [
  {
    title: "This month",
    value: "12,840",
    subtitle: "meals shared",
    image: picture1,
  },
  {
    title: "Food rescued",
    value: "6.1 t",
    subtitle: "from landfill",
    image: picture2,
  },
];

export default function ImpactStatsCards() {
  return (
    <div className="w-full flex flex-col items-center mt-8 mb-12">
      <div className="flex flex-col md:flex-row gap-16 w-full max-w-4xl justify-center">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center overflow-hidden min-w-[280px] max-w-[420px]"
            style={{ minHeight: 180 }}
          >
            <div className="flex-1 flex flex-col justify-center items-start p-6 z-10">
              <div className="text-gray-500 text-base mb-1">{stat.title}</div>
              <div className="text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-base">{stat.subtitle}</div>
            </div>
            <div className="flex-1 relative h-full w-full min-w-[120px] max-w-[200px]">
              <img
                src={stat.image}
                alt="food donation"
                className="object-cover w-full h-full opacity-80"
                style={{ minHeight: 180 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
