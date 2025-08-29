// src/components/hero/Hero.jsx
import Container from '../common/Container';
import Button from '../common/Button';
import HeroArt from './HeroArt';

export default function Hero() {
  return (
    <section className="bg-white h-[300vh]">
      <Container className="grid items-center gap-8 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            <span className="block">Save good food.</span>
            <span className="block text-yellow-500">Serve more people.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-700">
            We connect restaurants with NGOs and volunteers in Colombo to redirect surplus food—reducing waste and feeding communities.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="#donate">🍛 Donate Food</Button>
            <Button href="#request" variant="secondary">🤝 Request Food</Button>
          </div>
        </div>

        <HeroArt src="/hero.jpg" />
      </Container>
    </section>
  );
}
