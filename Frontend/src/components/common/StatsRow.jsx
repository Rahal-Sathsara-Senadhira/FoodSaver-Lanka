import assets from '../../assets/assets';

export default function StatsRow() {
  const stats = [
    { num: '35', title: 'Register Donors', subtitle: 'Restaurant, Bakeries, Hotels', img: assets.Resturent },
    { num: '78', title: 'Volunteer Fleet', subtitle: 'Drivers & riders', img: assets.Truck },
    { num: '20', title: 'Active NGOs', subtitle: 'Shelters & community orgs', img: assets.Globe },
    { num: '6.1', title: 'Monthly Savings', subtitle: 'Food diverted from landfill', unit: 'tons', img: assets.Savings }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div className="w-full flex flex-row items-center justify-between gap-6 md:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-6">
                  <div className="text-4xl md:text-6xl font-extrabold text-yellow-600 leading-tight">{s.num}{s.unit ? <span className="text-lg align-super">{s.unit}</span> : null}</div>
                  <div className="h-20 w-px bg-yellow-200" />
                  <div className="flex items-center justify-center w-24 h-24">
                    <img src={s.img} alt={s.title} className="w-20 h-20 object-contain" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-yellow-500 font-semibold text-lg">{s.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
