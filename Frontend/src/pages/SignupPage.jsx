import { useState, useEffect } from 'react';
import assets from '../assets/assets';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import HeroImage from '../assets/HeroImage.jpg';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return alert('Please fill required fields');
    if (form.password !== form.confirm) return alert('Passwords do not match');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-white flex items-center">
      <div className="relative w-full">
        <div className="grid grid-cols-12 min-h-screen">
          {/* Left image carousel column - large visual */}
          <div className="col-span-12 lg:col-span-7 relative overflow-hidden">
            {/* slideshow images (HeroImage + placeholders). You can replace/add images in this array */}
            {/* We'll render them stacked and crossfade by changing opacity */}
            {
              (() => {
                const slides = [
                  HeroImage,
                  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
                  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80'
                ];

                // component-local state for current index
                // Note: useEffect/state declared below — render here uses currentIndex from closure via hook
                return (
                  <LeftCarousel slides={slides} />
                );
              })()
            }

            
          </div>

          {/* Right form column */}
          <div className="col-span-12 lg:col-span-5 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              {/* Increased min height and padding for taller modern form */}
              <div className="bg-white/85 backdrop-blur-md border border-white/30 rounded-xl p-10 md:p-12 shadow-xl relative min-h-[640px] flex flex-col">
                <div className="mb-6">
                  <h1 className="text-3xl font-extrabold tracking-widest">WELCOME!</h1>
                  <p className="text-sm text-gray-600 mt-1">Create your account to start saving food</p>
                </div>

                <div className="flex-1">
                  {!submitted ? (
                    <form onSubmit={onSubmit} className="space-y-6">
                      {/* Username */}
                      <div>
                        <input
                          name="name"
                          value={form.name}
                          onChange={onChange}
                          className="w-full pl-4 pr-3 pb-2 pt-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-yellow-400 outline-none transition-colors text-lg"
                          placeholder="Username"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <input
                          name="email"
                          value={form.email}
                          onChange={onChange}
                          className="w-full pl-4 pr-3 pb-2 pt-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-yellow-400 outline-none transition-colors text-lg"
                          placeholder="Email"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <input
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={onChange}
                          className="w-full pl-4 pr-3 pb-2 pt-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-yellow-400 outline-none transition-colors text-lg"
                          placeholder="Password"
                        />
                      </div>

                      <div>
                        <input
                          type="password"
                          name="confirm"
                          value={form.confirm}
                          onChange={onChange}
                          className="w-full pl-4 pr-3 pb-2 pt-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-yellow-400 outline-none transition-colors text-lg"
                          placeholder="Confirm password"
                        />
                      </div>

                      <div className="flex items-center">
                        <input type="checkbox" id="terms" className="h-4 w-4" required />
                        <label htmlFor="terms" className="ml-3 text-sm text-gray-600">By checking this box, I agree to <span className="text-yellow-600 font-semibold">terms of service</span>.</label>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="w-full flex justify-center">
                          <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-8 rounded-md shadow-md transform transition hover:-translate-y-0.5 w-full max-w-xs text-center">
                            SIGN UP
                          </button>
                        </div>

                      
                      </div>
                    </form>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-4xl animate-pulse">✓</div>
                      <h3 className="text-xl font-semibold mb-2">Welcome aboard!</h3>
                      <p className="text-gray-600">Your account has been created. Check your email to verify and get started.</p>
                    </div>
                  )}
                </div>

                {/* Move sign-in link to bottom and center it */}
                <div className="mt-6 text-center text-sm text-gray-700">
                  Already a member? <a href="/login" className="text-yellow-600 font-semibold">Login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .transition { transition: all .22s ease; }
        @keyframes blob { 0% { transform: translateY(0) scale(1); } 33% { transform: translateY(-8px) scale(1.03); } 66% { transform: translateY(6px) scale(0.99); } 100% { transform: translateY(0) scale(1); } }
        .animate-blob { animation: blob 6s infinite ease-in-out; }
      `}</style>
    </div>
  );
}

function LeftCarousel({ slides }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="absolute inset-0">
      {slides.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${src})` }}
          aria-hidden
        />
      ))}
    </div>
  );
}
