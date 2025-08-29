// src/hooks/useGlassOnScroll.js
import { useEffect, useState } from 'react';

export default function useGlassOnScroll(threshold = 8) {
  const [glass, setGlass] = useState(false);
  useEffect(() => {
    const onScroll = () => setGlass(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return glass;
}
