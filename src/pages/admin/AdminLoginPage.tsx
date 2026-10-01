import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20';

export function AdminLoginPage() {
  const { login, isAdminDemoAccount } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAdminDemoAccount) return <Navigate to="/admin" replace />;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (email.trim().toLowerCase() !== 'admin@stayaura.demo') {
      setError('This demo portal only accepts the StayAura admin account.');
      return;
    }

    login(email.trim());
    navigate('/admin', { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 py-10 sm:px-6">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-[#17202A] via-[#253342] to-[#1E252B] p-8 text-white sm:p-10">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-lg font-bold">
            <Sparkles className="h-5 w-5 text-[#C5A880]" /> StayAura
          </Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-[#C5A880]">Administration</p>
          <h1 className="mt-3 font-display text-3xl font-bold">Admin sign in</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">Sign in to manage hotel operations and bookings.</p>
        </div>

        <form onSubmit={submit} className="space-y-4 p-8 sm:p-10">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-gray-700">Admin email</span>
            <span className="relative block">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass + ' pl-10'} placeholder="admin@stayaura.demo" />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-gray-700">Password</span>
            <span className="relative block">
              <LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass + ' pl-10'} placeholder="Enter any password in demo mode" />
            </span>
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
          <p className="rounded-xl bg-[#FAF5EB] px-3 py-2 text-xs text-[#765A32]">
            Demo admin: <strong>admin@stayaura.demo</strong>. Any password works in this prototype.
          </p>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2D3748]">
            <ShieldCheck className="h-4 w-4 text-[#C5A880]" /> Enter admin console <ArrowRight className="h-4 w-4 text-[#C5A880]" />
          </button>
          <p className="text-center text-[11px] leading-relaxed text-gray-500">Demo access only. This client-side check is not production security.</p>
          <Link to="/login" className="block text-center text-xs font-semibold text-[#977341] hover:underline">Guest member sign in</Link>
        </form>
      </section>
    </main>
  );
}
