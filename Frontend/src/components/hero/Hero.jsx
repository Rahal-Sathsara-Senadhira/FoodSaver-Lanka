// src/components/hero/Hero.jsx
import Container from "../common/Container";
import Button from "../common/Button";
import HeroArt from "./HeroArt";

export default function Hero() {
  return (
    <section className="relative bg-white">
      {/* LEFT faint background circle behind headline, like the design */}
      <div className="pointer-events-none absolute -left-40 top-56 h-[320px] w-[320px] rounded-full bg-yellow-200/30" />

      <Container className="relative grid items-center gap-14 py-20 lg:py-24 md:grid-cols-2">
        {/* Copy */}
        <div>
          <h1 className="font-extrabold tracking-tight text-gray-900">
            <span className="block text-[40px] leading-[1.1] sm:text-5xl lg:text-[64px]">
              Save good food.
            </span>
            <span className="block text-[40px] leading-[1.1] text-yellow-500 sm:text-5xl lg:text-[64px] font-black">
              Serve more people.
            </span>
          </h1>

          <p className="mt-7 max-w-[46ch] text-lg leading-8 text-gray-600">
            We connect restaurants with NGOs and volunteers in Colombo to
            redirect surplus food—reducing waste and feeding communities.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Button href="#donate" className="px-7 py-3.5 shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
              🍛 Donate Food
            </Button>
            <Button
              href="#request"
              variant="secondary"
              className="px-7 py-3.5 shadow-[0_6px_14px_rgba(0,0,0,0.08)]"
            >
              🤝 Request Food
            </Button>
          </div>
        </div>

        {/* Art */}
        <HeroArt />
      </Container>
    </section>
  );
}
