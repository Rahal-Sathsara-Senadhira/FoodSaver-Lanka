import { useState } from 'react';
import assets from '../assets/assets';
import Container from '../components/common/Container';
import HeroImage from '../assets/HeroImage.jpg';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please enter email and password');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Logged in (demo)');
    }, 800);
  }

  return (
    <div className="min-h-screen bg-white flex items-center">
      <div className="relative w-full">
        <div className="grid grid-cols-12 min-h-screen">
          <div className="col-span-12 lg:col-span-7 relative">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HeroImage})` }} aria-hidden />
            <div className="absolute inset-0 bg-black/15" aria-hidden />
          </div>

          <div className="col-span-12 lg:col-span-5 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-xl p-10 md:p-12 shadow-xl relative">
                <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
                <p className="text-sm text-gray-600 mb-6">Sign in to manage your donations and track collections.</p>

                <form onSubmit={onSubmit} className="space-y-4">
                  <input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full border rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-yellow-300"
                    placeholder="Email"
                  />

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    className="w-full border rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-yellow-300"
                    placeholder="Password"
                  />

                  {error && <div className="text-sm text-red-500">{error}</div>}

                  <div className="flex justify-center">
                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-8 rounded-md shadow-md">
                      {loading ? 'Signing...' : 'Log in'}
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-600 mt-4">Don't have an account? <a href="/signup" className="text-yellow-600 font-semibold">Sign up</a></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
