// src/components/nav/Navbar.jsx
import Container from '../common/Container';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import useGlassOnScroll from '../../hooks/useGlassOnScroll';
import { navLinks } from '../../data/navLinks';

export default function Navbar() {
  const glass = useGlassOnScroll(8);

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-all',
        glass
          ? 'backdrop-blur-xl bg-white/60 border-b border-black/5 shadow-sm'
          : 'bg-yellow-400',
      ].join(' ')}
    >
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}
               className="px-3 py-2 text-sm font-medium text-gray-800 hover:text-gray-900 hover:underline underline-offset-4">
              {l.label}
            </a>
          ))}
          <a href="#signup" className="ml-3 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
            Sign up
          </a>
        </nav>

        <MobileMenu links={navLinks} />
      </Container>
    </header>
  );
}
