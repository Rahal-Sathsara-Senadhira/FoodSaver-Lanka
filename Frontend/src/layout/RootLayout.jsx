// src/layout/RootLayout.jsx
import Navbar from '../components/nav/Navbar';

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {/* Add a simple footer later */}
    </>
  );
}
