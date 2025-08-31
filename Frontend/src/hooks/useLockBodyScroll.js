// src/hooks/useLockBodyScroll.js
import { useEffect } from 'react';
export default function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = overflow);
  }, [locked]);
}
