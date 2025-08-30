import assets from '../../assets/assets';
import Container from './Container';
import Button from './Button';

export default function ThreeStep() {
  const steps = [
    {
      num: '1',
      title: 'Donor posts surplus',
      text: 'Restaurants quickly publish item, quantity, pickup time, and safety notes.',
      img: assets.Resturent,
    },
    {
      num: '2',
      title: 'NGO reserves',
      text: 'Eligible NGOs nearby reserve items and receive pickup instructions.',
      img: assets.Globe,
    },
    {
      num: '3',
      title: 'Volunteer delivers',
      text: 'Drivers get notified, collect safely, and deliver to beneficiaries.',
      img: assets.Truck,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="text-sm text-gray-500">How it Works</div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">A simple 3-step flow</h2>
          <p className="mt-3 text-gray-400">Donors list surplus → NGOs request → Volunteers deliver</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.title} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-50 text-yellow-600 rounded-lg p-3 flex items-center justify-center">
                    <img src={s.img} alt={s.title} className="w-6 h-6 object-contain" />
                  </div>

                  <div>
                    <div className="text-lg font-semibold">{s.num}) {s.title}</div>
                    <div className="text-sm text-gray-500 mt-2 max-w-[28rem]">{s.text}</div>
                  </div>
                </div>

                <div className="mt-auto pt-4" />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button as="a" href="/donate" className="bg-black text-white px-8 py-3 rounded-full shadow-lg">Start Donating <span aria-hidden className="ml-3">→</span></Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
