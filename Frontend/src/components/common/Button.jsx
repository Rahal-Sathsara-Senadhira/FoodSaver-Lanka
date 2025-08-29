// src/components/common/Button.jsx
export default function Button({
  as = 'a',
  href = '#',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const base = 'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none';
  const variants = {
    primary: 'bg-black text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl focus:ring-2 focus:ring-black/30',
    secondary: 'border border-gray-300 bg-white text-gray-900 shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:ring-2 focus:ring-gray-300/60',
    link: 'text-gray-900 underline underline-offset-4',
  };
  const Comp = as;
  return (
    <Comp href={href} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Comp>
  );
}
