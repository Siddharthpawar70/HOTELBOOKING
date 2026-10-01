import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type AuthPageProps = { mode: 'login' | 'register' };

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20';

export function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === 'register';
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from || '/';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');

  const finishSignIn = (address: string, displayName?: string) => {
    login(address, displayName);
    navigate(destination, { replace: true });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (isRegister) {
      if (password.length < 8) { setError('Choose a password with at least 8 characters.'); return; }
      if (password !== confirmPassword) { setError('The passwords do not match.'); return; }
      if (!acceptTerms) { setError('Please accept the terms to create a demo account.'); return; }
      if (email.trim().toLowerCase() === 'admin@stayaura.demo') { setError('The demo admin account is reserved. Use the sign-in tab to preview the admin console.'); return; }
      finishSignIn(email.trim(), name.trim());
      return;
    }
    finishSignIn(email.trim());
  };

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#F7F6F2] px-4 py-10 sm:px-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl md:grid-cols-2">
        <div className="flex flex-col justify-between bg-gradient-to-br from-[#17202A] via-[#253342] to-[#1E252B] p-8 text-white sm:p-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-display text-lg font-bold"><Sparkles className="h-5 w-5 text-[#C5A880]" /> StayAura</Link>
            <p className="mt-12 text-xs font-bold uppercase tracking-[0.22em] text-[#C5A880]">StayAura Members</p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight">{isRegister ? 'Make every stay yours.' : 'Welcome back.'}</h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-300">{isRegister ? 'Create a demo traveller profile to keep your stays and preferences together.' : 'Sign in to see your trips, saved stays and member profile.'}</p>
          </div>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-gray-300"><ShieldCheck className="mr-2 inline h-4 w-4 text-[#C5A880]" />Prototype authentication: profile details stay in this browser. Passwords are not saved or verified.</div>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#977341]">{isRegister ? 'Create account' : 'Member sign in'}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-gray-900">{isRegister ? 'Register for StayAura' : 'Sign in to StayAura'}</h2>
          <p className="mt-2 text-sm text-gray-500">{isRegister ? 'Start your member profile in a few steps.' : 'Use your email to continue.'}</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {isRegister && <label className="block"><span className="mb-1.5 block text-xs font-bold text-gray-700">Full name</span><span className="relative block"><UserRound className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" /><input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={inputClass + ' pl-10'} placeholder="Your name" /></span></label>}
            <label className="block"><span className="mb-1.5 block text-xs font-bold text-gray-700">Email address</span><span className="relative block"><Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass + ' pl-10'} placeholder="name@example.com" /></span></label>
            <label className="block"><span className="mb-1.5 block text-xs font-bold text-gray-700">Password</span><span className="relative block"><LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" /><input required type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass + ' pl-10'} placeholder={isRegister ? 'At least 8 characters' : 'Enter any password in demo mode'} /></span></label>
            {isRegister && <label className="block"><span className="mb-1.5 block text-xs font-bold text-gray-700">Confirm password</span><input required type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} placeholder="Re-enter password" /></label>}
            {isRegister && <label className="flex items-start gap-2 text-xs leading-relaxed text-gray-600"><input checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} type="checkbox" className="mt-0.5 accent-[#977341]" /> I agree to the demo terms and privacy notice.</label>}
            {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
            {!isRegister && <p className="rounded-xl bg-[#FAF5EB] px-3 py-2 text-xs text-[#765A32]">Admin preview: sign in as <strong>admin@stayaura.demo</strong>. Any password works in this prototype.</p>}
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2D3748]">{isRegister ? 'Create demo account' : 'Sign in'} <ArrowRight className="h-4 w-4 text-[#C5A880]" /></button>
          </form>

          <div className="relative my-5 text-center text-xs text-gray-400 before:absolute before:left-0 before:top-1/2 before:h-px before:w-[42%] before:bg-gray-200 after:absolute after:right-0 after:top-1/2 after:h-px after:w-[42%] after:bg-gray-200">or continue with</div>
          <button type="button" onClick={() => finishSignIn('google.demo@stayaura.demo', 'Google Demo Guest')} className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"><span aria-hidden="true" className="font-bold text-[#4285F4]">G</span> Continue with Google <span className="text-[10px] font-medium text-gray-400">(demo)</span></button>
          <p className="mt-2 text-center text-[11px] text-gray-500">Google OAuth is not configured in this project; this button creates a demo profile only.</p>

          <p className="mt-6 text-center text-sm text-gray-600">{isRegister ? 'Already a member?' : 'New to StayAura?'} <Link to={isRegister ? '/login' : '/register'} className="font-bold text-[#977341] hover:underline">{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
        </div>
      </section>
    </main>
  );
}
