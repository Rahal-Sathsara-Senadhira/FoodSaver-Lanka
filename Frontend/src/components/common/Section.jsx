// src/components/common/Section.jsx
export default function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-28 ${className}`}>
      {children}
    </section>
  );
}
